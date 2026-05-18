ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS accommodation_fare numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS accommodation_currency text NOT NULL DEFAULT 'MXN';