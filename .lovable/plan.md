

## Switch to Guesty Open API for Inquiries

### What this fixes
The current Booking Engine API requires available dates to create an inquiry. The Open API lets us create inquiries directly with `status: "inquiry"` -- no date availability needed. Every form submission will land in your Guesty inbox.

### Changes

**1. Store new Open API credentials as secrets**

Two new secrets:
- `GUESTY_OPEN_API_CLIENT_ID` = `0oasxjn81wWHQpB4h5d7`
- `GUESTY_OPEN_API_CLIENT_SECRET` = `C1eVEQQ-zYCqu6Oepuqd13idKxc3miVzQ7jDYyVtVaBgjucgn9ZozqKRS6viJ7ir`

The existing `GUESTY_CLIENT_ID` / `GUESTY_CLIENT_SECRET` stay in place for the listings function.

**2. Rewrite `supabase/functions/guesty-inquiry/index.ts`**

Replace the entire Booking Engine quote-to-inquiry flow with a single Open API call:

```text
Token endpoint:  https://open-api.guesty.com/oauth2/token  (scope: open-api)
Inquiry endpoint: POST https://open-api.guesty.com/v1/reservations
```

The new flow:
1. Validate form input
2. Save to the `inquiries` database table (guaranteed)
3. Get an Open API token (cached as `open_api_access_token`)
4. POST to `/v1/reservations` with:
   - `listingId`: the estate listing ID
   - `status`: "inquiry"
   - `guest`: { firstName, lastName, email, phone }
   - `note`: compiled from preferred dates, group size, activities, message
5. If Guesty succeeds, update the DB row with the reservation ID
6. Return success to the user

No date availability check needed. The inquiry lands in your Guesty inbox every time.

**3. No frontend changes**

The `InquiryDialog.tsx` form and the "Check Availability" booking widget link both remain as-is. They serve different purposes:
- "Inquire" = custom form -> Open API inquiry (communication)
- "Check Availability" = Guesty hosted widget (date-based booking)

### Files modified
- `supabase/functions/guesty-inquiry/index.ts` -- rewrite to use Open API
- Two new secrets added

### After implementation
Test the form end-to-end and verify the inquiry appears in your Guesty inbox.
