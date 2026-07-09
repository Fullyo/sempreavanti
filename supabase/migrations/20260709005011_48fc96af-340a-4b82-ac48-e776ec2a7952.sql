ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS guesty_fare numeric;

COMMENT ON COLUMN public.bookings.guesty_fare IS 'Last accommodation fare pulled from Guesty (room-only, USD). When accommodation_fare differs from this, the concierge has manually edited the fare.';