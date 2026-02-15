

## Fix Guesty Inquiry Form -- Authentication Mismatch

### Root Cause

The edge function has **two separate problems**:

1. **Wrong endpoint for Booking Engine API**: It tries `POST https://booking.guesty.com/api/inquiries` which returns 404 -- this endpoint doesn't exist. The BE API requires creating a quote first, then converting it to an inquiry.

2. **Wrong token for Open API**: The fallback calls `https://open-api.guesty.com/v1/reservations` but uses a token obtained with scope `booking_engine:api` from `booking.guesty.com`. The Open API requires its own token with scope `open-api` from `open-api.guesty.com/oauth2/token`. That's why it returns 401 "Not Authorized".

### Solution

Rewrite the `getAccessToken` function and the inquiry submission to use the **Open API** exclusively:

- Get the OAuth token from `https://open-api.guesty.com/oauth2/token` with scope `open-api`
- POST the inquiry to `https://open-api.guesty.com/v1/reservations` with status `inquiry`
- Cache the Open API token separately (key: `open_api_access_token`) so it doesn't conflict with the existing BE token used by the listings function
- Remove the non-existent `/api/inquiries` endpoint call entirely

### File Change: `supabase/functions/guesty-inquiry/index.ts`

**Token function** -- change the OAuth endpoint and scope:
```text
Before:
  URL:   https://booking.guesty.com/oauth2/token
  scope: booking_engine:api

After:
  URL:   https://open-api.guesty.com/oauth2/token
  scope: open-api
```

Cache key changes from `access_token` to `open_api_access_token` to avoid collisions with the listings function's cached BE token.

**Inquiry submission** -- replace both attempts with a single correct call:
```text
POST https://open-api.guesty.com/v1/reservations
{
  listingId: "697bcfcf3f5e990014fbc4dd",
  status: "inquiry",
  guest: { firstName, lastName, email, phone },
  note: "..."
}
```

Also add response content-type checking before parsing JSON to handle unexpected HTML error pages gracefully.

### No other files change
The frontend `InquiryDialog.tsx` component is correct -- only the backend function needs fixing.

