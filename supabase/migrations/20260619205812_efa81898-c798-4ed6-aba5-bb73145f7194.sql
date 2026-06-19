ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS tip_cash_usd numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tip_cash_mxn numeric NOT NULL DEFAULT 0;