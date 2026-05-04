## Goal

Rebuild the AI-generated HTML guide (1,394 lines, 60 referenced images) as a hidden React page on the site, using photos pulled from your connected Google Drive (`Villas Sempre Avanti` folder).

## Steps

### 1. Pull images from Google Drive
- Recursively list every file under `Villas Sempre Avanti` and all subfolders (`Photos`, `Activities / Upsell`, `UTV Rental`, `Logo`, `Videos`, etc.) via the Drive connector gateway.
- Build a name index: lowercased filename → Drive file ID.
- For each of the 60 referenced images (e.g. `atv-sq1.jpg`, `monkey-coastal-sunset.jpg`, `og-cover.jpg`), match by filename (with/without extension, fuzzy on hyphens/underscores).

### 2. Upload matched images to `site-assets`
- Download each match from Drive (`/files/{id}?alt=media`) and upload to the existing public `site-assets` Supabase bucket under a new prefix `concierge-guide/`.
- Record the new public URL for each one.

### 3. Handle misses with a labeled placeholder
- For any image not found in Drive, generate a single solid-color SVG placeholder (e.g. magenta `#FF00FF`) with the missing filename rendered on top, upload it as `concierge-guide/_missing/{filename}.svg`, and use that.
- At the end, output a clear list of every missing filename so you know exactly what to drop into Drive later.

### 4. Build the hidden page
- Create `src/pages/ConciergeGuide.tsx` containing the converted HTML/CSS as JSX (Tailwind-friendly where trivial; otherwise inline `<style>` for fidelity to the original design).
- Rewrite all `images/xxx.jpg` references to the new `site-assets` public URLs.
- Add route `/concierge-guide` in `src/App.tsx`.

### 5. Keep it hidden
- Do **not** add it to `Navbar`, `Footer`, or `sitemap.xml`.
- Add `<meta name="robots" content="noindex,nofollow">` via a `<Helmet>` block on the page.
- Only reachable by typing the URL directly.

### 6. Deliverables back to you
- The hidden URL: `/concierge-guide`
- A list of any filenames that didn't match in Drive (rendered as magenta placeholders so they're obvious on the page).

## Technical notes
- Drive connector is already linked; uses gateway at `connector-gateway.lovable.dev/google_drive/drive/v3` with `LOVABLE_API_KEY` + `GOOGLE_DRIVE_API_KEY`.
- Storage target: existing public `site-assets` bucket (same place as current site photos) — no new bucket, no schema changes, no auth required.
- No DB tables, no edge functions needed for this task — purely static asset import + one new React route.

Approve and I'll execute.