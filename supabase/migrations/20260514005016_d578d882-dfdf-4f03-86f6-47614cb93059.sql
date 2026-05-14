
-- 1. Pin search_path and revoke public EXECUTE on email helper functions (SECURITY DEFINER)
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.enqueue_email(text, jsonb)              SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint)              SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb)  SET search_path = public, pgmq;

REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb)              FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint)              FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb)  FROM PUBLIC, anon, authenticated;

-- 2. Remove broad SELECT policy that lets anyone LIST the public bucket.
-- Direct file URLs (/object/public/...) still work because the bucket is public.
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
