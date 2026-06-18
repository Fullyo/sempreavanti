-- Remove permissive "allow all to public" policies. With RLS enabled and no
-- public policies, these tables are only reachable via the service role used by
-- the token-verified concierge-db edge function.
DROP POLICY IF EXISTS "Allow all on services" ON public.services;
DROP POLICY IF EXISTS "Allow all on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow all on petty_cash" ON public.petty_cash;

-- Revoke direct Data API access from anon/authenticated; keep service_role full access.
REVOKE ALL ON public.services FROM anon, authenticated;
REVOKE ALL ON public.bookings FROM anon, authenticated;
REVOKE ALL ON public.petty_cash FROM anon, authenticated;
GRANT ALL ON public.services TO service_role;
GRANT ALL ON public.bookings TO service_role;
GRANT ALL ON public.petty_cash TO service_role;