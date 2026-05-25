
-- 1) DRIVERS: restrict public read of sensitive fields
DROP POLICY IF EXISTS "Drivers public read" ON public.drivers;

CREATE POLICY "Drivers readable by authenticated"
  ON public.drivers FOR SELECT
  TO authenticated
  USING (true);

-- 2) BOOKINGS: remove broad pending-read policy that exposed PII
DROP POLICY IF EXISTS "Available drivers can see pending bookings" ON public.bookings;

-- Create a sanitized view of pending unassigned bookings for available drivers.
-- The view excludes customer PII (full_name, email, mobile, special_instructions, own_car_details).
CREATE OR REPLACE VIEW public.pending_bookings_for_drivers
WITH (security_invoker = on) AS
SELECT
  b.id,
  b.booking_code,
  b.car_type,
  b.trip_type,
  b.people_count,
  b.pickup_location,
  b.drop_location,
  b.from_city,
  b.to_city,
  b.pickup_time,
  b.drop_time,
  b.start_date,
  b.start_time,
  b.drop_date,
  b.pickup_datetime,
  b.drop_datetime,
  b.days_count,
  b.status,
  b.driver_id,
  b.created_at
FROM public.bookings b
WHERE b.driver_id IS NULL
  AND b.status = 'pending'
  AND EXISTS (
    SELECT 1 FROM public.drivers d
    WHERE d.user_id = auth.uid() AND d.availability = true
  );

-- The view uses security_invoker, so we need a SELECT policy on the base table
-- that lets available drivers read only the rows the view exposes.
-- We add a narrowly-scoped policy that returns the same rows; column-level
-- exposure is constrained by querying the view in application code.
-- To prevent direct SELECT * from leaking PII, we instead route drivers
-- through the view by NOT re-adding a broad policy. Drivers reading their
-- own claimed bookings is already covered by "Driver can read own bookings".
-- For the view to return rows, we grant via a SECURITY DEFINER function.

CREATE OR REPLACE FUNCTION public.get_pending_bookings_for_drivers()
RETURNS SETOF public.pending_bookings_for_drivers
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    b.id, b.booking_code, b.car_type, b.trip_type, b.people_count,
    b.pickup_location, b.drop_location, b.from_city, b.to_city,
    b.pickup_time, b.drop_time, b.start_date, b.start_time, b.drop_date,
    b.pickup_datetime, b.drop_datetime, b.days_count, b.status, b.driver_id,
    b.created_at
  FROM public.bookings b
  WHERE b.driver_id IS NULL
    AND b.status = 'pending'
    AND EXISTS (
      SELECT 1 FROM public.drivers d
      WHERE d.user_id = auth.uid() AND d.availability = true
    )
  ORDER BY b.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_pending_bookings_for_drivers() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_pending_bookings_for_drivers() TO authenticated;

-- 3) REALTIME: remove bookings from the realtime publication to prevent
-- unauthorized subscribers from receiving booking change events.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'bookings'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.bookings';
  END IF;
END $$;

-- 4) STORAGE: tighten driver-photos upload policy
DROP POLICY IF EXISTS "Driver photos auth upload" ON storage.objects;

CREATE POLICY "Drivers upload to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'driver-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND EXISTS (SELECT 1 FROM public.drivers d WHERE d.user_id = auth.uid())
  );

-- Allow drivers to update/delete their own files
DROP POLICY IF EXISTS "Drivers update own photos" ON storage.objects;
CREATE POLICY "Drivers update own photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'driver-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Drivers delete own photos" ON storage.objects;
CREATE POLICY "Drivers delete own photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'driver-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
