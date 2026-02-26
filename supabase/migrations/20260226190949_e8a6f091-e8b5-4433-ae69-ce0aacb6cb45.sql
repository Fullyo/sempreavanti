-- 1. Add explicit deny-all policy on inquiries table (service-role only access)
CREATE POLICY "Inquiries are managed server-side only"
ON public.inquiries
FOR ALL
USING (false)
WITH CHECK (false);

-- 2. Remove overly permissive storage upload policy (service-role only uploads)
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;