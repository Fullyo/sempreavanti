

## Fix Guesty Inquiry Delivery -- Definitive Solution

### Root Cause (confirmed from code + logs + docs)

Two bugs have prevented ALL inquiries from reaching Guesty:

1. **Wrong OAuth scope** (line 40 of guesty-inquiry): `scope: "open-api"` must be `scope: "booking_engine:api"`. The working availability function already uses the correct scope -- the inquiry function was never updated to match.
2. **Deprecated API endpoint**: `POST /api/reservations` with `status: "inquiry"` no longer works. Guesty's docs explicitly state: "The older Reservations V1 endpoint is being deprecated and should not be used in new implementations."

### The Fix: Two-Step Reservation Quote Flow

Per Guesty's official documentation, all booking operations must use the Reservation Quote Flow:

**Step 1 -- Create a quote**
```
POST https://booking.guesty.com/api/reservations/quotes
Body: { listingId, checkInDateLocalized, checkOutDateLocalized, guestsCount, guest: { firstName, lastName, email, phone } }
```

**Step 2 -- Convert quote to inquiry**
```
POST https://booking.guesty.com/api/reservations/quotes/{quoteId}/inquiry
```
Response: `{ "_id": "...", "status": "reserved", "platform": "direct" }`

This creates a reservation with status "reserved" (inquiry) that appears in the Guesty inbox and triggers your existing automated messages.

### Handling the Date Requirement

The quote endpoint requires structured check-in/check-out dates. Since the inquiry form uses free-text dates ("March 15-22, 2026"), the function will:
- Use **placeholder dates** (30 days from now, 4-night stay) to satisfy the API requirement
- Include the **real preferred dates** in the reservation notes so your team sees the actual request
- The placeholder dates are just to create the quote -- your team will see and adjust based on the notes

### How Questionnaire Data Appears in Guesty

- **Name, email, phone**: Structured fields on the reservation record (visible in Guesty guest info)
- **Preferred dates, group size, selected activities, message**: Combined into a detailed note attached to the reservation, formatted like:
  ```
  --- Website Inquiry ---
  Preferred Dates: March 15-22, 2026
  Group Size: 8 adults, 2 children
  Activities: Surfing, Private Chef, Yoga & Wellness
  Message: Celebrating our anniversary...
  ```

### Technical Changes

**File: `supabase/functions/guesty-inquiry/index.ts`** (rewrite Guesty integration logic)

1. Replace `getBookingApiToken` with the same proven `getAccessToken` pattern from `guesty-availability` (correct scope: `booking_engine:api`, same token caching via `guesty_cache` table, same cache key `access_token`)
2. Replace the single deprecated `POST /api/reservations` call with the two-step flow:
   - Step 1: `POST /api/reservations/quotes` with listing ID, placeholder dates, guest count (parsed from groupSize or default 2), and guest contact info
   - Step 2: `POST /api/reservations/quotes/{quoteId}/inquiry` to convert the quote into a reservation inquiry
3. Build a comprehensive note string from all questionnaire fields
4. Add detailed logging at every step for verification
5. Keep the database-first approach unchanged

**No frontend changes needed** -- the `InquiryDialog` already sends all required fields correctly.

### Verification After Deployment

I will call the edge function directly with test data to confirm each step succeeds and that a `guesty_reservation_id` is returned and saved to the database.

