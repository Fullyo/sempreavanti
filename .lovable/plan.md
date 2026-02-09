

# Fix: Navbar Readability, Guesty API, and Remove Unsplash Photos

## Issue 1: Navbar Impossible to Read on Scroll

The screenshot shows the scrolled navbar has `bg-cream/95` (very light, semi-transparent) with `text-muted-foreground` links -- low contrast, hard to read.

**Fix in `src/components/layout/Navbar.tsx`:**
- Change scrolled background from `bg-cream/95` to `bg-white/98 backdrop-blur-lg shadow-sm` for a solid, crisp white bar
- Change scrolled link color from `text-muted-foreground` to `text-foreground` (dark) for strong contrast
- Add a subtle `shadow-sm` to visually separate the navbar from content

## Issue 2: Guesty API Returning 500 -- All Layers Failing

The logs reveal exactly what is broken:

1. **Layer 3 (Open API):** `booking-api.guesty.com` gets a DNS resolution error -- this domain is unreachable from edge functions
2. **Layer 4 (Booking Engine):** `booking.guesty.com/api/listings` returns **401** because it requires the OAuth token but the code calls it without one
3. **Layer 2 (DB cache):** No cached data exists, so nothing to fall back to

The Guesty Booking Engine API docs confirm:
- Correct endpoint: `https://booking-api.guesty.com/v1/search` (not `/v1/listings`)
- Auth: `Authorization: Bearer {token}` is required on all calls
- The public `booking.guesty.com/api/listings` endpoint also needs auth

**Fix in `supabase/functions/guesty-listings/index.ts`:**

- **Layer 3:** Change the Open API URL from `booking-api.guesty.com` to `open-api.guesty.com` (the correct Open API domain). Also try the Booking Engine search endpoint `booking-api.guesty.com/v1/search`
- **Layer 4 (Booking Engine fallback):** Pass the OAuth access token to the Booking Engine call instead of calling it unauthenticated
- Add better logging to identify which step fails and why
- Reorder: try Booking Engine (with token) first since it's purpose-built for this use case, then Open API as fallback

## Issue 3: Remove ALL Unsplash Fallback Photos

The user explicitly does not want Unsplash stock photos. They want only real photos from the Guesty API.

**Fix in `src/hooks/useGuestyListings.ts`:**
- Remove all three Unsplash photo arrays (`pietroPhotos`, `luisaPhotos`, `estatePhotos`)
- Keep the fallback listing metadata (bedrooms, bathrooms, description, etc.) but set `pictures: []` on all fallback listings
- When the API returns empty photos, do NOT substitute Unsplash -- leave `pictures` empty
- Components consuming photos should handle empty arrays gracefully (show nothing rather than broken images)

**Fix in components that display photos (`Index.tsx`, `PhotoMosaicSection.tsx`, `VillaCarousel.tsx`, etc.):**
- Add null/empty checks: if `pictures.length === 0`, show nothing or a minimal text-only layout instead of broken image placeholders

---

## Files to Change

| File | Changes |
|------|---------|
| `src/components/layout/Navbar.tsx` | Solid white scrolled background, dark text for readability |
| `supabase/functions/guesty-listings/index.ts` | Fix API URLs and pass auth token to Booking Engine fallback |
| `src/hooks/useGuestyListings.ts` | Remove all Unsplash photo arrays, keep metadata-only fallbacks |
| `src/pages/Index.tsx` | Handle empty photos gracefully in estate carousel |
| `src/components/home/PhotoMosaicSection.tsx` | Handle empty photos gracefully |

