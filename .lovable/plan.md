

## Fix: Create True Inquiries (Not Reservations) in Guesty

### The Problem
The Booking Engine API's "inquiry" endpoint actually creates reservations with status "reserved", which blocks calendar dates. Your website form is meant to be a simple question/correspondence, not a booking.

### The Solution
Switch from the Booking Engine API to the Guesty **Open API** for inquiry submissions. The Open API's `POST /api/reservations` endpoint supports `status: "inquiry"` which:
- Appears in the Guesty inbox
- Does NOT block calendar dates
- Includes guest contact info and questionnaire data in notes

### What You Need To Provide
New API credentials with Open API access, created in your Guesty dashboard:
- Go to Guesty dashboard -> Marketplace or Developer Tools -> Open API
- Create a new integration to get a Client ID and Client Secret with `open-api` scope
- Share them so they can be added as backend secrets (`GUESTY_OPEN_API_CLIENT_ID` and `GUESTY_OPEN_API_CLIENT_SECRET`)

### Technical Changes

**File: `supabase/functions/guesty-inquiry/index.ts`** (rewrite)

1. Add a new `getOpenApiToken` function that requests a token from `https://open-api.guesty.com/v1/oauth2/token` with `scope: "open-api"` using the new credentials
2. Replace the entire two-step quote flow with a single API call:
   ```
   POST https://open-api.guesty.com/api/reservations
   {
     "listingId": "697bcfcf3f5e990014fbc4dd",
     "status": "inquiry",
     "guest": { "firstName", "lastName", "email", "phone" },
     "note": "--- Website Inquiry ---\nPreferred Dates: ...\nGroup Size: ...\nActivities: ...\nMessage: ..."
   }
   ```
3. Remove the `findAvailableDates` function (no longer needed -- inquiries don't require dates)
4. Keep the database-first approach and `guesty_reservation_id` writeback
5. Cache the Open API token separately (cache key: `open_api_access_token`) so it doesn't conflict with the Booking Engine API token used by the /book page

### What This Achieves
- Inquiries appear in Guesty inbox with status "inquiry" (not "reserved")
- Calendar is NOT blocked by website form submissions
- All questionnaire answers (activities, dates, group size, message) visible in the reservation notes
- Guest contact info (name, email, phone) stored as structured fields on the reservation
- The existing Booking Engine API integration for the /book page (calendar, pricing, instant booking) remains completely unchanged

### Verification Plan
After deployment, I will call the edge function with test data and confirm the response includes `status: "inquiry"`. You verify in Guesty that:
1. The inquiry appears in the inbox
2. The calendar is NOT blocked
3. All form data is visible in the notes

