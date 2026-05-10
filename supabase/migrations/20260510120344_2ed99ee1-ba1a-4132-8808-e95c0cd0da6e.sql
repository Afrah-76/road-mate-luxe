
-- CUSTOMERS
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  mobile text not null,
  created_at timestamptz not null default now()
);
alter table public.customers enable row level security;
create policy "Customers select own" on public.customers for select using (auth.uid() = user_id);
create policy "Customers insert own" on public.customers for insert with check (auth.uid() = user_id);
create policy "Customers update own" on public.customers for update using (auth.uid() = user_id);

-- DRIVERS
create table public.drivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  age int not null,
  address text not null,
  contact text not null,
  email text not null,
  availability boolean not null default true,
  profile_picture_url text,
  places_driven text[] not null default '{}',
  rating numeric(3,2) not null default 0,
  created_at timestamptz not null default now()
);
alter table public.drivers enable row level security;
create policy "Drivers public read" on public.drivers for select using (true);
create policy "Drivers insert own" on public.drivers for insert with check (auth.uid() = user_id);
create policy "Drivers update own" on public.drivers for update using (auth.uid() = user_id);

-- BOOKINGS
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  full_name text not null,
  people_count int not null,
  car_type text not null,
  pickup_location text not null,
  pickup_time text not null,
  drop_location text not null,
  drop_date date not null,
  drop_time text not null,
  start_date date not null,
  start_time text not null,
  days_count int not null,
  driver_id uuid references public.drivers(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
create policy "Customer can read own bookings" on public.bookings for select
  using (exists (select 1 from public.customers c where c.id = bookings.customer_id and c.user_id = auth.uid()));
create policy "Driver can read own bookings" on public.bookings for select
  using (exists (select 1 from public.drivers d where d.id = bookings.driver_id and d.user_id = auth.uid()));
create policy "Customer can insert booking" on public.bookings for insert
  with check (exists (select 1 from public.customers c where c.id = bookings.customer_id and c.user_id = auth.uid()));

-- REVIEWS
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  driver_id uuid not null references public.drivers(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
create policy "Reviews public read" on public.reviews for select using (true);
create policy "Customer insert review" on public.reviews for insert
  with check (exists (select 1 from public.customers c where c.id = reviews.customer_id and c.user_id = auth.uid()));

-- function to refresh driver rating
create or replace function public.refresh_driver_rating()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.drivers d
    set rating = coalesce((select round(avg(r.rating)::numeric, 2) from public.reviews r where r.driver_id = d.id), 0)
    where d.id = coalesce(new.driver_id, old.driver_id);
  return null;
end$$;
create trigger trg_refresh_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_driver_rating();

-- STORAGE bucket for driver photos
insert into storage.buckets (id, name, public) values ('driver-photos', 'driver-photos', true)
  on conflict (id) do nothing;

create policy "Driver photos public read" on storage.objects for select
  using (bucket_id = 'driver-photos');
create policy "Driver photos auth upload" on storage.objects for insert
  with check (bucket_id = 'driver-photos' and auth.uid() is not null);
create policy "Driver photos owner update" on storage.objects for update
  using (bucket_id = 'driver-photos' and auth.uid() = owner);
create policy "Driver photos owner delete" on storage.objects for delete
  using (bucket_id = 'driver-photos' and auth.uid() = owner);
