

## Fix Checkout Direct Link + Add Full Amenities List

### 1. Fix "Book Now" to go directly to checkout

The `/checkout` path on Guesty's booking engine DOES work -- your screenshot confirms it loads the payment form directly at:
`villassempreavanti.guestybookings.com/en/properties/{id}/checkout?minOccupancy=2&checkIn=...&checkOut=...`

The fix is simple: append `/checkout` to `CHECKOUT_BASE` in `src/pages/Book.tsx`.

```
// Current (goes to property page)
const CHECKOUT_BASE = `https://villassempreavanti.guestybookings.com/en/properties/${LISTING_ID}`;

// Fixed (goes directly to payment form)
const CHECKOUT_BASE = `https://villassempreavanti.guestybookings.com/en/properties/${LISTING_ID}/checkout`;
```

### 2. Add full amenities from Guesty API

Keep the current curated 3x3 key amenities grid (Private Beach, Two Infinity Pools, etc.) as a highlight section. Below it, add an expandable "All Amenities" section that pulls the complete amenities list from the Guesty API.

The API returns 80+ amenities per listing (accessibility, kitchen items, safety features, activities, etc.). These will be:
- Deduplicated across all listings
- Filtered to remove redundant/internal items (e.g., "Cleaning Disinfection", "Essentials")
- Grouped into categories matching the Guesty booking engine layout:
  - **Accessibility** (Wide doorway, Wide clearance to bed, etc.)
  - **Bathroom** (Body soap, Shampoo, Shower gel, Hot water, etc.)
  - **Safety** (Smoke detector, Carbon monoxide detector, Fire extinguisher, etc.)
  - **Kitchen & Dining** (Coffee maker, Blender, Cookware, Microwave, etc.)
  - **Outdoor** (Private pool, BBQ grill, Fire Pit, Hammock, Patio, etc.)
  - **Activities** (Fishing, Horseback Riding, Cycling, Water Sports, etc.)
  - **General** (Air conditioning, WiFi, Washer, Dryer, etc.)
- Displayed in a collapsible accordion or "Show all amenities" expandable section
- Uses the `useGuestyListings` hook already available in the project

### Technical Details

**Files to modify:**

- **`src/pages/Book.tsx`** -- Change `CHECKOUT_BASE` to include `/checkout` path. Remove the "You'll confirm your booking on the next page" helper text since guests now land directly on the payment form.

- **`src/components/book/AmenitiesGrid.tsx`** -- Keep the existing 3x3 key amenities grid. Add below it a "View all amenities" button that expands to show the full categorized list pulled from `useGuestyListings()`. Each category displayed as a heading with a grid of amenity items beneath it, matching the style shown on the Guesty booking engine page.
