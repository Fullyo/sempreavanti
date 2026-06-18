ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS pay_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS exchange_rate numeric NOT NULL DEFAULT 16,
  ADD COLUMN IF NOT EXISTS guest_gratuity numeric,
  ADD COLUMN IF NOT EXISTS guest_tip numeric,
  ADD COLUMN IF NOT EXISTS amount_paid numeric,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_pay_token_idx ON public.bookings (pay_token);