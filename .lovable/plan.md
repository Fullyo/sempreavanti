
# Weddings and Private Events Page Overhaul

## Overview
Restructure both celebration pages to: move inquiry forms before the bottom hero/CTA banner, replace all PhotoPlaceholders with real images (uploaded + existing estate assets), and add the three new wedding photos.

## New Assets
- Copy `wedding.png` to `src/assets/wedding-ceremony.png` (couple at altar)
- Copy `beachceremony.png` to `src/assets/wedding-beach-ceremony.png` (bohemian beach setup)
- Copy `beachwedding.png` to `src/assets/wedding-celebration.png` (petal toss celebration)

## Weddings Page (`src/pages/Weddings.tsx`)

### New Section Flow (top to bottom):
1. **Hero** -- keep `wedding2.png` (current hero)
2. **Intro** -- keep as-is
3. **Features (with real images)** -- replace PhotoPlaceholders:
   - Beach Ceremony: `wedding-beach-ceremony.png` (the bohemian setup photo)
   - Beachfront Dining: `estate-3.jpeg` (beachfront estate shot)
   - Bar & Cocktails: `chef-margarita.jpeg` (cocktails)
   - Accommodation: `estate-sleeping.jpg` (aerial DJI shot of estate)
   - Full Coordination: `wedding-ceremony.png` (couple at altar -- shows the team in action)
4. **Gallery** -- replace 4 placeholders with real photos:
   - `wedding-ceremony.png`, `wedding-celebration.png`, `estate-5.jpeg`, `estate-8.jpeg`
5. **Inquiry Form** -- moved BEFORE the CTA banner
6. **Organizer note** -- kept with the form section
7. **CTA Hero Banner** -- the `estate3` dark overlay section, now at the very bottom, with a subtle note for wedding planners/coordinators

### Private Events Page (`src/pages/PrivateEvents.tsx`)

### New Section Flow:
1. **Hero** -- replace PhotoPlaceholder with `estate-11.jpeg` (scenic estate shot)
2. **Intro** -- keep as-is
3. **Event Types** -- replace PhotoPlaceholders with estate/food images:
   - Retreats & Workshops: `wellness-yoga.png`
   - Corporate Offsites: `estate-7.jpeg`
   - Bachelorette & Birthday: `chef-margarita.jpeg`
   - Family Gatherings: `estate-1.jpeg`
   - Fire Pit Evenings: `estate-12.jpeg`
   - Long-Table Beachfront Dinners: `food1.jpeg`
4. **Venue Spaces** -- replace PhotoPlaceholders:
   - Private Beach: `estate-3.jpeg`
   - Fire Pit: `estate-8.jpeg`
   - Pool Terraces: `estate-6.jpeg`
   - Beachfront Dining: `food3.jpeg`
5. **Services text** -- keep as-is
6. **Inquiry Form** -- moved BEFORE the bottom CTA
7. **Organizer note** -- kept near form
8. **CTA Hero Banner** -- `estate6` dark overlay, now at the very bottom, with subtle coordinator note

## Technical Details

### Files to create:
- `src/assets/wedding-ceremony.png` (from `user-uploads://wedding.png`)
- `src/assets/wedding-beach-ceremony.png` (from `user-uploads://beachceremony.png`)
- `src/assets/wedding-celebration.png` (from `user-uploads://beachwedding.png`)

### Files to modify:
- **`src/pages/Weddings.tsx`**: Add new image imports, assign images to each feature, replace gallery placeholders, reorder sections (form before CTA banner)
- **`src/pages/PrivateEvents.tsx`**: Add estate/food image imports, replace all placeholders with real images, replace hero placeholder with estate photo, reorder sections (form before CTA banner)

### Image assignments use only existing assets plus the 3 new uploads -- no placeholders remain on either page.
