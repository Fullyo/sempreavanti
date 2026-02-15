

## Fix Guest Limit, Error Handling, and Expand Gallery

### Issue 1: MAX_GUESTS capped at 12

The property allows up to 14 guests (with an extra $100/night surcharge for guests 13 and 14, configured in Guesty). The Guesty API handles this surcharge automatically in the quote response. The last fix incorrectly lowered MAX_GUESTS to 12, blocking guests 13-14 entirely.

**Fix:** Change `MAX_GUESTS` back to `14` in `src/pages/Book.tsx`.

### Issue 2: Edge function error message is misleading

When the quote API returns any 400 error, the edge function currently returns a hardcoded message: "Guest count exceeds maximum allowed". This is inaccurate -- a 400 could be for many reasons (invalid dates, listing unavailable, etc.).

**Fix:** In `supabase/functions/guesty-availability/index.ts`, change the error response to pass through the actual API error message instead of a hardcoded guess. Parse the error body from Guesty and return a generic but accurate message like "Unable to get pricing" with the details for debugging.

### Issue 3: Gallery should include more photos

The current gallery only shows the 16 estate-*.jpeg files. Additional relevant photos already exist in the project assets that showcase different parts of the property:

- `estate-sleeping.jpg` (bedroom configuration)
- `villa-hero.jpg` (villa exterior)
- `private-beach.png` (the private beach)
- `wellness-drone.jpg` (aerial/drone view of property)
- `patzcuarito.png` / `patzcuarito-hero.png` (nearby area)
- Various food/chef photos that show the on-site dining experience

**Fix:** Add `estate-sleeping.jpg`, `villa-hero.jpg`, `private-beach.png`, and `wellness-drone.jpg` to the gallery in `src/components/book/PropertyGallery.tsx`. These show the bedrooms, villa exterior, beach, and aerial view -- all core property features a booking guest would want to see.

### Files Modified

- `src/pages/Book.tsx` -- change `MAX_GUESTS` from 12 to 14
- `supabase/functions/guesty-availability/index.ts` -- fix error message to pass through actual API error instead of hardcoded text
- `src/components/book/PropertyGallery.tsx` -- add additional property photos to the gallery carousel

