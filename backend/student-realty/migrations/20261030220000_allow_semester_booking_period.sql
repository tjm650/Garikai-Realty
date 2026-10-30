-- Permit semester as a first-class booking rental period.
-- Existing rows remain valid because the previous constraint only allowed day/week/month.
ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_rental_period_check;

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_rental_period_check
  CHECK (rental_period = ANY (ARRAY['day'::text, 'week'::text, 'month'::text, 'semester'::text]));
