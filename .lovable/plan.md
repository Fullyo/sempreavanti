

## Redesign /book Page: Airbnb-Style Photo Grid + Optimized Content Flow

### Current Issues
- The hero banner at the top feels redundant -- it's a large image with overlay text that pushes the actual property content far down the page
- The photo carousel below the hero only shows one photo at a time in a constrained container, making it hard to appreciate the property
- The overall flow requires too much scrolling before reaching the booking calendar

### Proposed New Layout (Top to Bottom)

**1. Remove the full-width hero banner entirely**

Replace it with a clean, minimal header area (property title + subtitle) that flows directly into the photo grid. This is how Airbnb and the Guesty booking engine handle it -- no hero banner, just straight into the content.

**2. Airbnb-style photo mosaic grid (replaces both hero + carousel)**

A 5-photo grid layout that shows the property at a glance:
- 1 large main photo (left, takes 50% width, full height)
- 4 smaller photos (right side, 2x2 grid)
- A "Show all photos" button that opens a full-screen gallery/lightbox with all Guesty API photos
- Photos fill the full viewport width (edge-to-edge) or a generous container
- Rounded corners on the outer edges only (matching the Airbnb aesthetic)
- On mobile: stack as a single carousel with a photo counter

```text
+----------------------------+-------------+-------------+
|                            |             |             |
|        Main Photo          |   Photo 2   |   Photo 3   |
|        (large)             |             |             |
|                            +-------------+-------------+
|                            |             |             |
|                            |   Photo 4   |   Photo 5   |
|                            |             |             |
+----------------------------+-------------+-------------+
                                    [ Show all 92 photos ]
```

**3. Property title + overview bar (immediately below photos)**

Move the property name and the stats bar (5 BR, 7 beds, 5.5 bath, 14 guests, check-in/out times) to sit right under the photo grid. This gives instant context.

**4. Two-column layout: Description (left) + Booking sidebar (right)**

Restructure the main content into a side-by-side layout (like Airbnb):
- **Left column (2/3 width)**: Property description accordion sections, amenities grid, available services
- **Right column (1/3 width, sticky)**: The booking sidebar with calendar, guest selector, pricing, and Book Now button

This eliminates the current flow where the user has to scroll past ALL the property content to reach the calendar. The calendar is always visible as they explore.

**5. Calendar section**

The dual-month calendar and date selector remain unchanged (as requested). They just move into the sticky sidebar instead of being a separate full-width section at the bottom.

**6. Footer CTA**

Keep the "Have Questions?" section at the bottom.

### Technical Details

**New component: `src/components/book/PhotoGrid.tsx`**
- Receives photos from `useGuestyListings` (same data source as current PropertyGallery)
- Renders the 5-photo mosaic grid on desktop
- Falls back to a carousel with counter on mobile (reuses embla-carousel)
- "Show all photos" button opens a full-screen dialog/sheet with all photos in a scrollable grid
- Uses local fallback photos when API is unavailable

**Files to modify:**
- **`src/pages/Book.tsx`** -- Major restructure:
  - Remove the hero section entirely
  - Add a minimal title/subtitle header
  - Replace `PropertyGallery` with new `PhotoGrid`
  - Move `PropertyOverview` stats directly under the photo grid
  - Wrap description/amenities/services and the booking sidebar in a 2-column grid layout
  - The calendar + pricing sidebar becomes a sticky right column
  - Remove the separate full-width calendar section

- **`src/components/book/PropertyGallery.tsx`** -- Will be replaced by the new `PhotoGrid` component (can be deleted or left unused)

- **`src/components/book/PropertyOverview.tsx`** -- Minor style adjustments to work inline below the photo grid instead of as a full-width section

**New file:**
- **`src/components/book/PhotoGrid.tsx`** -- Airbnb-style photo mosaic with lightbox

### Mobile Behavior
- Photo grid collapses to a swipeable carousel with a "1 / 92" counter overlay
- The booking sidebar unsticks and moves below the property content sections
- Calendar remains full-width on mobile (unchanged)

