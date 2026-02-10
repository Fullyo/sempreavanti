
# Fix Villas Page: Correct Data, Full-Size Carousel, Combined Amenities Section

## The Problem

The right-side villa shows **Sempre Avanti** (the combined 5BR estate listing) instead of **Villa Luisa** because the code uses `.find()` searching for "luisa" in the title -- but the Sempre Avanti listing's title also contains "Villa Luisa", and it appears earlier in the API results, so it matches first.

## Changes

### 1. Fix Villa Luisa data matching (src/pages/Villas.tsx)

Instead of searching by name substring (which matches the wrong listing), match by Guesty listing ID or by exact nickname:
- Casa Pietro: nickname === "Casa Pietro" (ID: `697bcfb8c91d8d0015ca285a`)
- Villa Luisa: nickname === "Villa Luisa" (ID: `697bcfe3a874360012e8aa31`)

This guarantees the correct listing data (3 BR / 3.5 Bath / 8 Guests) and the correct Villa Luisa description and photos are shown on the right side.

### 2. Full-size carousel images (src/components/VillaCarousel.tsx)

Currently the carousel shows 3 partial images side-by-side (`flex-[0_0_33.333%]`). Change to show one full-width image at a time (`flex-[0_0_100%]`) so each photo fills the entire card width. Remove the `mt-12` top margin since it serves as the main visual for each villa card. Keep the navigation arrows.

### 3. Rename "The Grounds" section to a combined estate highlight

Replace the current "The Grounds / A Private Resort" section with a combined stats-forward section:
- Title: something like "Five Bedrooms. Two Pools. One Private Beach."
- Eyebrow: "The Complete Estate"
- Show combined stats prominently: 5 Bedrooms, 5.5 Bathrooms, Sleeps 14, 250ft Private Beach
- Keep 4 feature icons but update to more relevant ones:
  - Private Beach (Waves icon)
  - Two Infinity Pools (Droplets icon)  
  - Beachfront Dining (UtensilsCrossed icon)
  - Fire Pit & Lounge (Flame icon)

### 4. Remove individual amenity tags

The small amenity squares below each villa's text are already removed in the current code, so no change needed there. The stats (bedrooms, bathrooms, guests) remain prominent.

### 5. Update fallback data (src/hooks/useGuestyListings.ts)

Update the fallback Villa Luisa description to match the actual Guesty API description (tropical elegance, 3 spacious bedrooms, poolside tiki bar and pizza oven, etc.) instead of the generic text currently there.

## Technical Details

**File: src/pages/Villas.tsx**
- Change villa matching from `.includes("pietro")` / `.includes("luisa")` to matching by exact nickname or `_id`
- Update VillaCarousel usage: remove `slice(1)` so all photos are included
- Rename "The Grounds" section heading and update feature icons/descriptions
- Hardcode display names as "Casa Pietro" and "Villa Luisa" (not relying on API nickname which could change)

**File: src/components/VillaCarousel.tsx**  
- Change slide width from `flex-[0_0_33.333%]` to `flex-[0_0_100%]`
- Remove `mt-12` class from wrapper
- Remove `pictures.slice(1)` -- show all photos including the first one
- Adjust image height for full-width display

**File: src/hooks/useGuestyListings.ts**
- Update Villa Luisa fallback summary to match real Guesty data
