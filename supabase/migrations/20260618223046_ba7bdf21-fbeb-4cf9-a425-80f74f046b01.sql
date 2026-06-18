-- Lock down storage writes on site-assets: public read stays, writes restricted to service_role
CREATE POLICY "Public read site-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

CREATE POLICY "Service role can write site-assets"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Service role can update site-assets"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'site-assets')
WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Service role can delete site-assets"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'site-assets');