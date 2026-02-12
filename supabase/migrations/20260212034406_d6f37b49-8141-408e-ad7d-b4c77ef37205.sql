INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-assets', 'site-assets', true);

CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'site-assets');