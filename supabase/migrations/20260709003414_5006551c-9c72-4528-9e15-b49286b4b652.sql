-- 1. New columns on bookings to absorb Guesty reservation data
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS guesty_id text,
  ADD COLUMN IF NOT EXISTS meal_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS listing_name text,
  ADD COLUMN IF NOT EXISTS nights integer,
  ADD COLUMN IF NOT EXISTS res_status text,
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual';

-- One booking per Guesty reservation (nulls allowed for manual bookings)
CREATE UNIQUE INDEX IF NOT EXISTS bookings_guesty_id_key
  ON public.bookings (guesty_id) WHERE guesty_id IS NOT NULL;

-- Fast lookup by meal token (used by the public meal planner)
CREATE INDEX IF NOT EXISTS bookings_meal_token_idx ON public.bookings (meal_token);

-- 2. Backfill: every existing Guesty reservation becomes a booking,
-- carrying its meal_token so existing meal-planner links keep working.
INSERT INTO public.bookings
  (guesty_id, guest, checkin, checkout, nights, listing_name, res_status,
   meal_token, source, accommodation_fare, accommodation_currency)
SELECT
  r.guesty_id,
  COALESCE(r.guest, 'Guest'),
  r.checkin,
  COALESCE(r.checkout, r.checkin),
  r.nights,
  r.listing_name,
  r.status,
  r.meal_token,
  'guesty',
  0,
  'usd'
FROM public.reservations r
WHERE r.checkin IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.bookings b WHERE b.guesty_id = r.guesty_id
  );