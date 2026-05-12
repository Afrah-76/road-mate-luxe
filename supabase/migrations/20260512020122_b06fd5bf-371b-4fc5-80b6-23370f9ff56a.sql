-- Extend bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS trip_type text NOT NULL DEFAULT 'one_way',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS booking_code text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS mobile text,
  ADD COLUMN IF NOT EXISTS from_city text,
  ADD COLUMN IF NOT EXISTS to_city text,
  ADD COLUMN IF NOT EXISTS drop_datetime timestamptz,
  ADD COLUMN IF NOT EXISTS pickup_datetime timestamptz,
  ADD COLUMN IF NOT EXISTS own_car_details jsonb,
  ADD COLUMN IF NOT EXISTS special_instructions text;

-- Relax NOT NULL constraints on legacy fields so the new form can omit them
ALTER TABLE public.bookings ALTER COLUMN pickup_time DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN drop_time DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN drop_date DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN drop_location DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN days_count DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN start_time DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_booking_code_idx ON public.bookings(booking_code);

-- Allow available drivers to read pending unassigned bookings (for notifications)
CREATE POLICY "Available drivers can see pending bookings"
ON public.bookings
FOR SELECT
USING (
  driver_id IS NULL
  AND status = 'pending'
  AND EXISTS (
    SELECT 1 FROM public.drivers d
    WHERE d.user_id = auth.uid() AND d.availability = true
  )
);

-- Allow a driver to claim an unassigned booking (first-accept wins)
CREATE POLICY "Driver can claim unassigned booking"
ON public.bookings
FOR UPDATE
USING (
  driver_id IS NULL
  AND status = 'pending'
  AND EXISTS (
    SELECT 1 FROM public.drivers d
    WHERE d.user_id = auth.uid() AND d.availability = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.drivers d
    WHERE d.id = bookings.driver_id AND d.user_id = auth.uid()
  )
);

-- Allow assigned driver to update status of their own bookings
CREATE POLICY "Driver can update own booking"
ON public.bookings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.drivers d
    WHERE d.id = bookings.driver_id AND d.user_id = auth.uid()
  )
);

-- Reviews: add trip rating + tags
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS trip_rating integer,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL;

-- Enable realtime on bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;