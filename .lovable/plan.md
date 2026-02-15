

## Fix Pricing + Enrich the Booking Page

### Problem 1: Pricing Fails on Valid Dates

The Guesty Booking Engine API requires fields named `checkInDateLocalized` and `checkOutDateLocalized`, but the edge function sends `checkIn` and `checkOut`. The API returns a 400 error: `"checkInDateLocalized" is required`.

**Fix:** Change the field names in the quote request body inside `supabase/functions/guesty-availability/index.ts`.

### Problem 2: Booking Page Lacks Property Information

The current `/book` page only shows a calendar and quote sidebar. The Guesty hosted page includes:
- Photo gallery (92 photos)
- Full property description
- "The Space" details for each villa
- Guest access info
- Property features (5 bedrooms, 7 beds, 5.5 bathrooms)
- Amenities list
- Check-in/check-out times
- Neighborhood and getting around info

### Solution

#### 1. Fix the Edge Function (guesty-availability)

Change the quote request body from:
```text
{ listingId, checkIn, checkOut, guests }
```
to:
```text
{ listingId, checkInDateLocalized, checkOutDateLocalized, guestsCount }
```
This matches the documented Guesty Booking Engine API field names.

#### 2. Add Property Content to the Book Page

Below the hero and above the calendar, add a rich property section with content from the Guesty listing. Since this content is static (it doesn't change), we'll hardcode it directly in the component rather than making another API call. This avoids rate limits and loads instantly.

The enriched page will include:

**Photo Gallery** -- A carousel of estate photos using images already in `src/assets/estate-*.jpeg` (16 photos already available in the project).

**Property Overview** -- Key stats bar showing 5 Bedrooms, 7 Beds, 5.5 Bathrooms, 14 Guests, with check-in (4 PM) and check-out (11 AM) times.

**Description Section** -- The full property description from Guesty, covering the estate overview, Villa Luisa details, Casa Pietro details, and included services (housekeeping, chef, concierge).

**Amenities Grid** -- A styled grid showing key amenities: private beach, infinity pools, ocean views, air conditioning, WiFi, full kitchen, BBQ, pizza oven, etc.

**Additional Services** -- List of bookable activities (ATV, surfing, yoga, horseback riding, etc.) with a link to the Experiences page.

Then the calendar + booking sidebar section follows below.

### Page Layout (top to bottom)

```text
1. Hero (existing, keep as-is)
2. Photo Gallery Carousel (estate photos)
3. Property Overview Bar (beds/baths/guests/check-in times)
4. Description (collapsible "Read More")
5. Amenities Grid
6. Available Services
7. Calendar + Quote Sidebar (existing, fix quote API)
8. Footer CTA (contact/inquire link)
```

### Files Modified

- `supabase/functions/guesty-availability/index.ts` -- fix quote field names
- `src/pages/Book.tsx` -- add property content sections above the calendar

### Technical Notes

- The estate photos (`estate-1.jpeg` through `estate-16.jpeg`) are already in the project assets
- The `VillaCarousel` component already exists and can be reused for the photo gallery
- All property text is hardcoded from the Guesty listing to avoid extra API calls
- The calendar and quote sidebar logic stays the same, just the API field names change
