

# Fix Wellness Hero Image -- New Approach via Storage

## Why Previous Attempts Failed

Every attempt to copy the uploaded yoga photo to `src/assets/` has silently failed -- the file gets created but contains the old/wrong image data. This appears to be a persistent issue with the local file copy mechanism for this particular asset.

## New Strategy: Use Supabase Storage

Instead of fighting with local asset copies, we will:

1. **Create a storage bucket** called `site-assets` in the backend (public, for serving static images)
2. **Upload** `user-uploads://yogahero-5.png` to that bucket via an edge function or direct upload
3. **Update `src/pages/Wellness.tsx`** to use the public storage URL for the hero image instead of a local import

This completely sidesteps the broken local file copy mechanism.

## Steps

1. Create a public `site-assets` storage bucket (via SQL migration)
2. Upload the yoga hero image to that bucket
3. In `Wellness.tsx`, replace the local import with the Supabase storage public URL:
   - Remove: `import heroImg from "@/assets/wellness-hero-new.png"`
   - Add: construct the URL from the storage bucket
   - Update the hero `<img>` tag to use this URL

## Technical Details

**Migration SQL:**
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-assets', 'site-assets', true);

CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'site-assets');
```

**Wellness.tsx changes:**
- Remove the `heroImg` import line for `wellness-hero-new.png`
- Add a constant with the public storage URL for the uploaded image
- The hero section `<img src={heroImg}>` will point to the storage URL

**Files modified:**
- `src/pages/Wellness.tsx` -- switch hero image source from local import to storage URL
- New migration for `site-assets` bucket
