
revoke execute on function public.refresh_driver_rating() from public, anon, authenticated;

drop policy if exists "Driver photos public read" on storage.objects;
create policy "Driver photos auth list" on storage.objects for select
  using (bucket_id = 'driver-photos' and auth.uid() is not null);
