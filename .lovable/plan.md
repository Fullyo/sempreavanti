
# Complete Fix: Photos, Navbar, Homepage Rebuild

## Problem Summary

There are three critical issues:

1. **Photos are completely broken** -- the Guesty API is rate-limited (429), the Booking Engine API returns 401, the DB cache is empty, and the fallback listings have `pictures: []`. Result: every photo on the entire site is a solid dark blue block.

2. **The navbar is not truly transparent** -- while the scroll logic exists, `Layout.tsx` adds `pt-16 md:pt-20` padding, pushing the hero content below the navbar instead of letting it render behind/under it. The hero never sits behind the transparent nav.

3. **The homepage is weak** -- it doesn't represent all services, has no guest reviews, poor SEO structure, and doesn't follow the pattern of the reference site (Casa Tara).

---

## Part 1: Fix Photos Immediately

Since both Guesty APIs are rate-limited and the DB cache is empty, we need to populate the cache with real photo URLs right now.

**Approach:** Create an edge function `seed-guesty-cache` that scrapes the Guesty Booking Engine *website* (not API) to extract photo URLs from the rendered page. However, since that page is client-rendered and hard to scrape, the more reliable approach is:

**Use a DB migration to seed `guesty_cache` with the actual Guesty CDN photo URLs.** These URLs follow the pattern `https://assets.guesty.com/image/...` and are publicly accessible CDN links that don't expire. We can extract them by:

1. Adding a temporary "cache seeder" edge function that authenticates with the Guesty Booking Engine API (using the same credentials but via `booking_engine:api` scope) and stores the response
2. OR (more immediately) updating the **fallback data** in `useGuestyListings.ts` to include real Guesty CDN photo URLs

Since the token rate limit is blocking us entirely and we can't obtain any fresh data, the practical solution is:

**Option A (Recommended):** Update the edge function to also try the Guesty **Open API** listings endpoint (`open-api.guesty.com/v1/listings`) which uses a DIFFERENT token endpoint (`open-api.guesty.com/oauth2/token`) and may have separate rate limits from the Booking Engine API.

**Option B (Immediate fallback):** The user likely has photos of the property. We can:
- Upload property photos to Lovable Cloud storage
- Reference them in the fallback data
- These will always work regardless of API status

**Option C (Best of both worlds):** Fix the edge function to try BOTH API endpoints (Open API + Booking Engine), AND populate the fallback listings with uploaded photos as the ultimate safety net.

I recommend **Option C** with these changes:

### Edge Function Changes (`supabase/functions/guesty-listings/index.ts`)
- Add Layer 3.5: Try the **Open API** token endpoint (`https://open-api.guesty.com/oauth2/token`) with `grant_type=client_credentials` -- this is a completely separate endpoint from the Booking Engine token endpoint and likely has its own rate limit
- The Booking Engine API currently tries `booking.guesty.com/oauth2/token` for auth AND `booking.guesty.com/api/listings` for data -- these share the same token
- Add the Open API as an alternative: `open-api.guesty.com/oauth2/token` for auth + `open-api.guesty.com/v1/listings` for data

### Fallback Photo Solution
- Ask the user to upload 10-15 property photos
- Store them in Lovable Cloud storage
- Update fallback listings in `useGuestyListings.ts` to reference these storage URLs
- This ensures photos ALWAYS display even when both APIs are fully locked out

---

## Part 2: Fix Transparent Navbar

The navbar code already has transparent-to-solid scroll logic, but `Layout.tsx` pushes content down with `pt-16 md:pt-20`, so the hero image never sits behind the navbar.

### Changes:

**`Layout.tsx`** -- Remove the top padding from `<main>`:
- Change `<main className="flex-1 pt-16 md:pt-20">` to `<main className="flex-1">`

**Every page except Index** -- Add individual top padding since their heroes need space below a solid nav:
- Each page's hero section already has `h-[60vh]` or similar, but non-homepage pages that don't have a full-bleed hero will need `pt-16 md:pt-20` added to their first section

**`HeroSection.tsx`** (homepage) -- Already has `h-[90vh]` which will naturally sit behind the transparent nav. No changes needed.

**Other page heroes** (`Villas.tsx`, `Chef.tsx`, `Concierge.tsx`, `Contact.tsx`, `Wellness.tsx`, `Experiences.tsx`, `Events.tsx`, `Location.tsx`, `Transportation.tsx`) -- These all have dark hero sections with `h-[60vh]` or `h-[50vh]`. They already render full-bleed, so removing the Layout padding will let them sit behind the navbar too, which is correct for a luxury site.

---

## Part 3: Complete Homepage Rebuild

Based on the reference site (Casa Tara) and the pages that exist, the homepage should include these sections in order:

### Section 1: Full-Screen Hero (existing, keep)
- Full viewport height with property photo
- Transparent navbar overlaid
- Title, subtitle, two CTAs

### Section 2: Estate Introduction (existing, improve)
- Stats row: 5 Bedrooms, 5 Bathrooms, Sleeps 10, Private Beach, Full Staff
- Two villa photo cards linking to /villas
- More descriptive copy

### Section 3: Services & Amenities Grid (NEW)
- Icon grid showing all included services:
  - Private Chef
  - Daily Housekeeping
  - Personal Concierge
  - Beach & Pool
  - Fire Pit
  - Wellness
  - UTV Transportation
  - WiFi & AC
- Links to relevant pages

### Section 4: Experience Cards (existing "Flow of Day", expand)
- Keep the 4-card layout but expand to cover ALL service pages:
  - Wellness (/wellness)
  - Private Dining (/chef)
  - Adventures & Experiences (/experiences)
  - Weddings & Events (/events)
  - Transportation (/transportation)
  - Location (/location)

### Section 5: Location Preview (NEW)
- Alternating image + text layout (like the reference)
- Aerial or beach photo
- Brief location description
- "Explore the Area" CTA linking to /location

### Section 6: Culinary Preview (NEW)
- Photo + text highlighting the private chef experience
- Sample dishes mentioned
- CTA to /chef

### Section 7: The Hospitality Philosophy (existing, keep)
- "Hosted, Not Rented" section with staff stats

### Section 8: Guest Reviews (NEW -- critical for direct booking SEO)
- 3-4 featured testimonial cards with:
  - Star rating (5 stars)
  - Quote text
  - Guest name and stay type (e.g., "Family Vacation, March 2025")
- Hardcoded initially (reviews from Guesty or Airbnb can be added later)

### Section 9: Quote/Philosophy (existing, keep)

### Section 10: Final CTA (existing, keep)
- Full-width photo background
- "Your Private Beachfront Awaits"
- Inquire + Check Availability buttons

### SEO Improvements
- Proper semantic HTML: `<article>`, `<section>` with `aria-label`
- Meta description via `<Helmet>` or document title
- Heading hierarchy (single H1, proper H2/H3 structure)
- Alt text on all images
- Schema.org structured data for vacation rental (JSON-LD in index.html)

---

## Files to Change

| File | Changes |
|------|---------|
| `src/components/layout/Layout.tsx` | Remove `pt-16 md:pt-20` from main |
| `src/pages/Index.tsx` | Complete rebuild with all new sections |
| `src/components/home/HeroSection.tsx` | Minor: ensure proper heading hierarchy |
| `src/components/home/FlowOfDaySection.tsx` | Expand to cover more pages (6 cards) |
| `src/components/home/HospitalitySection.tsx` | Keep, minor refinements |
| `src/components/home/QuoteSection.tsx` | Keep as-is |
| `src/components/home/PhotoMosaicSection.tsx` | May remove or reposition |
| NEW: `src/components/home/ServicesGrid.tsx` | Included services icon grid |
| NEW: `src/components/home/LocationPreview.tsx` | Location teaser with photo + text |
| NEW: `src/components/home/CulinaryPreview.tsx` | Chef experience teaser |
| NEW: `src/components/home/GuestReviews.tsx` | Featured testimonials |
| `supabase/functions/guesty-listings/index.ts` | Add Open API as alternate endpoint |
| `src/hooks/useGuestyListings.ts` | Add real photo URLs to fallback data |
| `index.html` | Add meta description, JSON-LD schema |
| All page files | Adjust hero sections for transparent nav overlap |

---

## Questions I Need Answered Before Implementation

Before building, I need to clarify:

1. **Photos**: Do you have property photos you can upload directly? This would solve the photo problem immediately while we work on the API fix. The Guesty API rate limit won't reset for up to 24 hours.

2. **Guest Reviews**: Do you have 3-4 guest testimonials/reviews you'd like featured? I can use placeholder text initially, but real reviews convert much better.
