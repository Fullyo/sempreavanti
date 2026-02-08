
-- Create guesty_cache table for persistent API caching
CREATE TABLE public.guesty_cache (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guesty_cache ENABLE ROW LEVEL SECURITY;

-- Allow public reads (edge function reads via anon key)
CREATE POLICY "Allow public read access to cache"
ON public.guesty_cache
FOR SELECT
USING (true);

-- No INSERT/UPDATE/DELETE policies for anon — edge function uses service role key
