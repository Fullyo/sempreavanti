

## Fix Inquiry Notes and Date Display

### Problem 1: Missing Notes/Activities/Message
The notes API endpoint `/v1/communication/reservations/{id}/notes` returned "Not Found". The Guesty Open API uses a different endpoint for reservation notes.

**Fix:** Try the correct Guesty Open API endpoint for adding notes to a reservation. Based on the API structure, the options are:
- `PUT /v1/reservations/{id}` with a `note` field in the body (update the reservation itself)
- If that doesn't support notes, fall back to including the note content in the guest's `remarks` or custom fields

The note string is already being built correctly (activities, dates, message). Only the delivery mechanism needs to change.

### Problem 2: Random Check-in/Check-out Dates
Guesty requires dates even for inquiries. The current code sets placeholder dates 1 year in the future. This is confusing when you view the inquiry in Guesty.

**Fix:** Include the user's "Preferred Dates" text prominently in the note/remarks so it's immediately visible when you open the inquiry. The placeholder dates are unavoidable (API requirement) but the real requested dates will be clearly labeled in the notes.

### Technical Changes

**File: `supabase/functions/guesty-inquiry/index.ts`**

1. Replace the failed `/v1/communication/reservations/{id}/notes` call with `PUT /v1/reservations/{id}` to update the reservation's note field directly
2. If the `note` field isn't supported on PUT, try adding it as part of the initial `POST /v1/reservations` body using alternative field names (`customFields`, `remarks`, or `guestComment`)
3. Keep the note string format:
   ```
   --- Website Inquiry ---
   Preferred Dates: March 6
   Group Size: 8 adults
   Activities: Surfing, Sailing, Massage & Spa
   Message: Tequilla
   ```

### What This Achieves
- All form data (activities, message, preferred dates, group size) will be visible on the inquiry in Guesty
- The placeholder dates remain (required by API) but real requested dates are clearly shown in the notes
- No changes needed to the frontend form
