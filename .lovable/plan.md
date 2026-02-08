

# Multi-Issue Fix: Currency, Navbar, Photos, Villas Gallery, and Copy

## Issues to Address

1. **MXN prices need USD conversion** across Experiences, Wellness, and Transportation pages
2. **Navbar needs transparent-to-solid scroll behavior** (luxury standard)
3. **Mobile menu needs dark background** for readability
4. **Check Availability URL is wrong** -- needs the correct listing-specific URL
5. **Pages don't scroll to top** on navigation
6. **HospitalitySection "On-Site Daily: Yes" stat is meaningless** -- needs a real stat
7. **Villas page needs a photo carousel** for each villa (scrollable gallery instead of static grid)
8. **Photos not loading because API is rate-limited and DB cache is empty** -- need to seed the cache via a migration with the actual Guesty listing data, so photos work immediately

---

## 1. Convert MXN Prices to USD

All guest-facing prices are in Mexican Pesos. Convert to approximate USD equivalents and add a small note about exchange rates. Using ~20 MXN = 1 USD as a round number.

**Files:** `Experiences.tsx`, `Wellness.tsx`, `Transportation.tsx`

Examples:
- $1,200 MXN becomes ~$60 USD
- $5,000 MXN becomes ~$250 USD
- $9,500 MXN becomes ~$475 USD

Each page will include a small footer note: *"Prices shown in USD are approximate. Final pricing is in Mexican Pesos at the current exchange rate."*

---

## 2. Transparent Navbar with Solid on Scroll

**File:** `Navbar.tsx`

- Start with a fully transparent background (`bg-transparent`) and white text when at the top of the page
- On scroll (past ~50px), transition to solid background (`bg-background/95 backdrop-blur-md`) with dark text
- Use a `useEffect` with a scroll listener and state toggle
- Mobile hamburger icon color also adapts
- Border only appears after scroll

---

## 3. Dark Mobile Menu

**File:** `Navbar.tsx`

- Change mobile menu background from `bg-background` (white/cream) to `bg-primary` (deep ocean blue) with `text-primary-foreground` (light text)
- Links become light-colored for contrast
- CTA button styling adapts accordingly

---

## 4. Fix Check Availability URL

**File:** `Navbar.tsx`

- Update both desktop and mobile CTA links from the generic properties URL to:
  `https://casasempreavanti.guestybookings.com/en/properties/697bcfcf3f5e990014fbc4dd?minOccupancy=1`

---

## 5. Scroll to Top on Navigation

**File:** `App.tsx`

- Add a `ScrollToTop` component that listens to `useLocation()` changes and calls `window.scrollTo(0, 0)` on every route change
- Place it inside the `BrowserRouter`

---

## 6. Fix "On-Site Daily: Yes" Stat

**File:** `HospitalitySection.tsx`

- Replace `{ label: "On-Site Daily", value: "Yes" }` with something meaningful like `{ label: "Years of Service", value: "8+" }` or `{ label: "Daily Meals", value: "3" }`

---

## 7. Villa Photo Carousel

**File:** `Villas.tsx`

- Replace the static 3-column photo grid for each villa with an **Embla carousel** (already installed as `embla-carousel-react`)
- Show all available villa photos in a horizontal scrollable carousel with navigation arrows
- Each photo fills the carousel at a comfortable height (~400px)
- Navigation dots or arrows for browsing
- This replaces the current `villa!.pictures.slice(1, 13)` static grid

---

## 8. Seed the DB Cache with Guesty Data

The Guesty API token limit is exhausted (3 tokens per 24h). The DB cache table (`guesty_cache`) is empty because a token was never successfully obtained and cached. Until the rate limit resets, the site shows zero photos.

**Solution:** Write a database migration that seeds the `guesty_cache` table with the actual Guesty API response data (listing details and photo URLs). This ensures:
- Photos load immediately, even before the API rate limit resets
- Once the rate limit resets, the edge function will naturally refresh the cache with fresh data
- The seeded data acts as a permanent fallback layer

This requires running the edge function once successfully to capture the response, OR manually inserting the known listing data structure. Since we can't call the API right now, I'll insert the listing metadata from the fallback data in the hook -- but **with the real Guesty photo URLs** extracted from the booking engine's CDN pattern. 

Alternatively, the simplest approach: update the edge function to also try the **Booking Engine API** endpoint (`https://booking.guesty.com/api/listings`) which may have separate rate limits from the Open API token endpoint.

---

## Files to Change

| File | Changes |
|------|---------|
| `src/App.tsx` | Add ScrollToTop component |
| `src/components/layout/Navbar.tsx` | Transparent-to-solid scroll, dark mobile menu, correct URL |
| `src/pages/Experiences.tsx` | Convert all MXN prices to USD with exchange rate note |
| `src/pages/Wellness.tsx` | Convert all MXN prices to USD with exchange rate note |
| `src/pages/Transportation.tsx` | Convert all MXN prices to USD with exchange rate note |
| `src/components/home/HospitalitySection.tsx` | Fix "On-Site Daily: Yes" stat |
| `src/pages/Villas.tsx` | Replace static photo grid with Embla carousel per villa |
| `supabase/functions/guesty-listings/index.ts` | Add Booking Engine API as fallback endpoint |

