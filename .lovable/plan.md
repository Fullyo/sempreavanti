
# Comprehensive Site-Wide Fix: Layout, Icons, Distances, Card Balance, and Organic Shapes

## Issues Identified

1. **Wavy SVG divider on hero** -- unprofessional, remove it
2. **Estate section layout is wrong** -- centered title + stats left + carousel right is disjointed. Needs to match the Casa Tara reference: eyebrow + title + description + stats on the LEFT, scrolling carousel on the RIGHT, all in one clean two-column row
3. **Teal/turquoise icons in ServicesGrid are hard to read** -- switch to golden/accent or a darker ocean color
4. **Organic photo shapes not applied to inner pages** -- all inner pages still use square/rectangular photos and cards
5. **Experiences page card imbalance** -- "Taste of Mexico" has 2 cards, "On the Water" has 5, "Golf" has 4, "Tee Off" has 4. Grids of 2, 4, 5 items look unbalanced in a 3-column layout
6. **Location distances are WRONG throughout the entire site** -- San Pancho is listed as 15 min (it's ~8 min), Punta de Mita as 15 min (it's ~25 min), etc.
7. **Inner pages don't use the new organic shape language** -- all still have sharp rectangular cards and photos

---

## 1. Remove Wavy Hero Divider

**File:** `src/components/home/HeroSection.tsx`

Remove the SVG wave div at lines 71-75. Clean bottom edge.

---

## 2. Rebuild Estate Section (Casa Tara Style)

**File:** `src/pages/Index.tsx`

Replace the current estate section (centered SectionHeading + grid) with a proper two-column layout:

**Left column:**
- Small eyebrow: "The Estate"
- Large serif title: "More Than a Stay -- A Destination"
- Decorative divider line with golden dot (like Casa Tara)
- Two paragraphs of description
- Stats in a 2x2 grid with golden icons: 5 Bedrooms, 10 Guests, 5 Bathrooms, Private Beach
- "Explore the Villas" CTA button (rounded-full, outlined)

**Right column:**
- Full-height Embla carousel with organic rounded corners (`rounded-tr-[60px] rounded-bl-[60px]`)
- Navigation arrows overlaid
- Thumbnail strip below the carousel showing 6-8 small preview images

No more centered heading above the grid. Everything flows in a single two-column row.

---

## 3. Fix ServicesGrid Icons

**File:** `src/components/home/ServicesGrid.tsx`

Change icon color from `text-turquoise` to `text-golden` (the golden yellow). Much better readability on the warm cream background, and matches the brand's signature golden wall accent.

---

## 4. Fix ALL Location Distances Site-Wide

Based on the actual coordinates (20.847732, -105.4615155):

| Destination | WRONG (current) | CORRECT |
|---|---|---|
| Sayulita | 10 min | 5 min by UTV |
| San Pancho | 15 min | 8 min by UTV |
| Punta de Mita | 15 min | 20-25 min |
| La Cruz de Huanacaxtle | 20 min | 25-30 min |
| Puerto Vallarta Airport | 45 min | 45 min (correct) |

**Files to update:**
- `src/pages/Location.tsx` -- `nearbyPlaces` array
- `src/pages/Transportation.tsx` -- `driveTimes` array  
- `src/components/home/LocationPreview.tsx` -- description text mentioning "10 minutes"
- `src/components/home/FlowOfDaySection.tsx` -- location card description

---

## 5. Fix Card Balance on Experiences Page

**File:** `src/pages/Experiences.tsx`

For categories with 2, 4, or 5 items that look unbalanced in a 3-column grid:

- **"Taste of Mexico" (2 items):** Add 1 more experience (e.g., "Mezcal & Tequila Tasting" or "Market-to-Table Tour") to make it 3
- **"On the Water" (6 items):** Already balanced at 6 (2 rows of 3) -- good
- **"Golf" (4 items):** Change to a 2-column layout for this section (2x2 grid), or add 2 more options
- **"Land & Adventure" (5 items):** Add 1 more (e.g., "Jungle Night Walk" or "Bird Watching Tour") to make 6
- **"Cultural & Local" (4 items):** Add 2 more items to make 6, or use 2-column layout

Strategy: For sections with fewer than 3 items, use `lg:grid-cols-2` instead of `lg:grid-cols-3`. For sections with 4-5 items, either pad to 6 or use adaptive column count.

---

## 6. Apply Organic Shapes to All Inner Pages

Currently every inner page uses sharp rectangular cards (`bg-card p-8`, `bg-background border border-border p-6`). Apply the same organic shape language from the homepage:

**Consistent changes across ALL inner pages:**

- Hero photos: already full-bleed, fine
- Section photos/placeholders: Add rounded corners (`rounded-2xl` or alternating `rounded-tl-[40px] rounded-br-[40px]`)
- Cards: Add `rounded-xl` to all card containers
- CTA buttons: Ensure all use `rounded-full` (some currently have no border-radius)
- Photo grids: Use organic rounded corners on grid items

**Files:**
- `src/pages/Experiences.tsx` -- card styling
- `src/pages/Wellness.tsx` -- card/photo styling
- `src/pages/Chef.tsx` -- photo and card styling
- `src/pages/Villas.tsx` -- feature cards, photo gallery
- `src/pages/Events.tsx` -- event cards
- `src/pages/Transportation.tsx` -- transport cards
- `src/pages/Concierge.tsx` -- staff cards/photos
- `src/pages/Contact.tsx` -- form container
- `src/pages/Location.tsx` -- place cards, map container

---

## Files to Change

| File | Changes |
|------|---------|
| `src/components/home/HeroSection.tsx` | Remove SVG wave divider |
| `src/pages/Index.tsx` | Rebuild estate section: left text+stats, right carousel with thumbnails |
| `src/components/home/ServicesGrid.tsx` | Change icon color from turquoise to golden |
| `src/pages/Location.tsx` | Fix all distances, add rounded corners |
| `src/pages/Transportation.tsx` | Fix drive times, add rounded corners |
| `src/components/home/LocationPreview.tsx` | Fix distance in description text |
| `src/components/home/FlowOfDaySection.tsx` | Fix location card distance |
| `src/pages/Experiences.tsx` | Balance card counts, add rounded corners to all cards |
| `src/pages/Wellness.tsx` | Add organic rounded corners to cards/photos |
| `src/pages/Chef.tsx` | Add organic rounded corners to cards/photos |
| `src/pages/Villas.tsx` | Add rounded corners to feature cards, gallery |
| `src/pages/Events.tsx` | Add rounded corners to event cards |
| `src/pages/Concierge.tsx` | Add rounded corners to staff photos |
| `src/pages/Contact.tsx` | Add rounded corners to form, CTA button |
