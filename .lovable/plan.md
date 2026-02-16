

## Fix: Post Form Data as a Message in the Guesty Inbox

### What's been happening
The `guestRemarks` and `specialRequests` fields we've been writing to are stored on the reservation record but are NOT displayed in the inbox conversation view. That's why you see "New guest inquiry" with nothing else.

### The fix
Use Guesty's Communications API to post an actual message into the conversation thread:

1. After creating the inquiry reservation, fetch its conversation using `GET /v1/communication/conversations?reservationId={id}`
2. Post the form details as a message using `POST /v1/communication/conversations/{conversationId}/send-message`
3. This message will appear directly in the inbox thread — exactly where you're looking

### What changes

**File: `supabase/functions/guesty-inquiry/index.ts`**

Replace the current notes section (the `PUT /v1/reservations-v3/{id}/notes` call) with two API calls:

```text
Step 1: GET conversation for the reservation
  GET https://open-api.guesty.com/v1/communication/conversations?reservationId={id}
  -> extract conversationId from response

Step 2: POST message to conversation  
  POST https://open-api.guesty.com/v1/communication/conversations/{conversationId}/send-message
  Body: { body: noteString, module: "email" }
```

The `noteString` already contains the correctly formatted data:
```
--- Website Inquiry ---
Preferred Dates: March 15-22, 2026
Group Size: 8 adults
Activities: Surfing, Sailing, Massage and Spa
Message: Tequilla
```

### What stays the same
- The inquiry creation (POST /v1/reservations with status: "inquiry") -- this works perfectly
- The frontend form -- no changes needed
- The database-first save -- all inquiries are still stored locally first
- The placeholder dates (required by API) remain, but the real preferred dates are now visible in the conversation

### Is this the last step?
Yes. The inquiry creation works. The form data is being captured. The only broken piece is getting that data to display in your inbox view. This fix targets that exact location.

### Technical details

The full notes section replacement in `supabase/functions/guesty-inquiry/index.ts` (lines ~187-215):

```typescript
// Fetch the conversation for this reservation
const convResponse = await fetch(
  `https://open-api.guesty.com/v1/communication/conversations?reservationId=${guestyReservationId}`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

if (convResponse.ok) {
  const convData = await convResponse.json();
  const conversationId = convData?.results?.[0]?._id;
  
  if (conversationId) {
    // Post message to the conversation thread
    const msgResponse = await fetch(
      `https://open-api.guesty.com/v1/communication/conversations/${conversationId}/send-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          body: noteString,
        }),
      }
    );
    // Log success/failure
  }
}
```

