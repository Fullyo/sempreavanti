

## Launch Readiness Checklist

### 1. Favicon
- Copy `hero-villa.png` to `public/favicon.png`
- Update `index.html` to add `<link rel="icon" href="/favicon.png" type="image/png">`
- The hero villa image will serve as the site's browser tab icon

### 2. Social Share (OG) Image
- The OG image and Twitter image currently point to a generic Unsplash stock photo (`images.unsplash.com/photo-1499793983394...`) -- not your property
- Replace with `hero-villa.png` hosted as a public asset at `https://sempreavanti.lovable.app/hero-villa.png`
- Update all three places in `index.html`: `og:image`, `twitter:image`, and the JSON-LD `image` field
- Copy `hero-villa.png` to `public/` so it's accessible at the root URL

### 3. SEO Audit Findings
- **OG/Twitter images**: Using stock photo instead of property photo (fixed above)
- **robots.txt**: Looks good -- allows all crawlers
- **JSON-LD structured data**: Well-formed LodgingBusiness schema, good to go
- **Meta descriptions**: Present and descriptive
- **Canonical URL**: Set correctly
- **Missing**: No sitemap.xml -- will add a basic one listing all pages
- **Missing**: No `<link rel="icon">` tag at all currently (fixed above)
- **Page titles**: Only the homepage has a custom title; subpages inherit the same one. This is fine for now since React SPA routing doesn't change the document title, but could be improved later.

### 4. Inquiry Dialog -- Subtle Asymmetric Corners
- Currently the dialog uses `rounded-2xl` (uniform corners)
- Change to the estate's signature asymmetric corner style: `rounded-tr-[30px] rounded-bl-[30px]` on the outer `DialogContent`
- Keep it subtle (30px, not 60px like the photo frames) so no form content gets clipped
- The hero header image inside will also get matching asymmetric rounding on the bottom: `rounded-bl-[30px]` to create a gentle curved transition into the form area

### 5. Mobile Responsiveness Check
- Will do a visual check on mobile viewport after implementation
- The current codebase uses responsive grid classes throughout (`grid-cols-1 sm:grid-cols-2`, etc.)
- The inquiry dialog already has `max-h-[90vh]` with scroll, which works well on mobile

### 6. Google Analytics
- Will add a placeholder `<!-- Google Analytics -->` comment in `index.html` with instructions
- You'll need to create a Google Analytics 4 property at analytics.google.com, get your Measurement ID (starts with `G-`), and share it with me so I can add the tracking script

### 7. Sitemap
- Create `public/sitemap.xml` listing all public routes for better search engine crawling
- Update `robots.txt` to reference the sitemap

---

### Technical Details

**Files to modify:**
- `index.html` -- favicon link, OG/Twitter images, JSON-LD image, GA placeholder
- `src/components/InquiryDialog.tsx` -- asymmetric corner styling on DialogContent and header
- `public/robots.txt` -- add sitemap reference

**Files to create:**
- `public/favicon.png` -- copied from hero-villa.png
- `public/hero-villa.png` -- copied for OG image (needs absolute public URL)
- `public/sitemap.xml` -- all routes listed

**Dialog corner change (InquiryDialog.tsx):**
```
DialogContent className changes:
  from: "rounded-2xl"
  to:   "rounded-tr-[30px] rounded-bl-[30px]"

Header div gets: "rounded-bl-[30px]" on the bottom edge
```

