

## 1. Make "Your Stay" Card Sticky From Property Description Down

### Current Problem
The booking card sits inside the calendar section only. When users scroll through property details, they lose sight of it. When they're in the calendar picking dates, they can't see the pricing update.

### Solution
Restructure the page so that everything below the photo grid and overview stats lives inside ONE two-column grid:
- **Left column (2/3)**: Property description, amenities, services, then the dual-month calendars -- all stacked vertically
- **Right column (1/3)**: The "Your Stay" booking card with `sticky top-24`, floating alongside ALL left-column content as the user scrolls

On mobile, the layout stacks naturally: all left-column content first, then the booking card, then a "Select Your Dates" section with the calendars below.

### File: `src/pages/Book.tsx`
- Remove the separate `bg-card` calendar section wrapper
- Merge property details and calendar into one left column
- Add `lg:sticky lg:top-24` back to the booking card wrapper
- On mobile, place the booking card between property content and calendars so it's accessible without excessive scrolling

## 2. Fix Guesty Inquiry Delivery (Credentials Issue)

### Current Problem
The edge function logs show:
```
Open API token request failed: 401
"This client does not have an access to https://open-api.guesty.com
please use https://booking.guesty.com instead"
```

Inquiries save to the database successfully but never reach Guesty's inbox because the Open API credentials are rejected.

### Solution
Update `supabase/functions/guesty-inquiry/index.ts` to use the **Booking API** (`booking.guesty.com`) instead of the Open API for creating inquiries. This is the same API that successfully powers the calendar and quotes. The function will:
- Use `GUESTY_CLIENT_ID` / `GUESTY_CLIENT_SECRET` (the working Booking API credentials) instead of the Open API credentials
- Hit the Booking API's reservation/inquiry endpoint
- Keep the database-first approach unchanged (save locally, then push to Guesty)

### Files to Modify
- **`src/pages/Book.tsx`** -- Restructure layout into single two-column grid with sticky sidebar
- **`supabase/functions/guesty-inquiry/index.ts`** -- Switch from Open API to Booking API credentials and endpoint

