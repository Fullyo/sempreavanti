

## Instant Booking Flow + Inquiry Button

### What Changes

The current two-step flow ("Get Quote" then "Book Now") becomes a single smooth flow:

1. Guest selects dates on the calendar
2. Price loads automatically (no button click needed)
3. Two action buttons appear:
   - **Book Now** (primary) -- sends them to Guesty's secure checkout with pre-filled dates
   - **Have Questions?** (secondary) -- opens the existing inquiry popup form

### Why This Works

- The Guesty Booking Engine API `quotes` endpoint only returns pricing -- it never creates a reservation. The actual booking always happens on Guesty's checkout page. So showing the price automatically is just a better UX; it doesn't change the booking mechanics.
- Your inquiry popup uses a completely separate API (Guesty Open API) and is independent of the booking engine. No conflict.
- Your API key is set to allow instant bookings, so the checkout page will let guests pay immediately.

### Detailed Changes

**File: `src/pages/Book.tsx`**

1. **Auto-fetch pricing**: When both check-in and check-out are selected (and nights >= 3), automatically call `fetchQuote()` instead of waiting for a button click. Remove the "Get Quote" button entirely.

2. **Replace "Book Now" section**: Instead of showing "Book Now" only after a quote loads, show two buttons once dates are selected and price is loaded:
   - "Book Now" -- primary gold button, same redirect to Guesty checkout as today
   - "Ask a Question" -- secondary outlined button, wrapped in `<InquiryDialog>` to open the existing popup form

3. **Update copy**: Change hero subtitle from "see real-time pricing" to "book your private beachfront retreat" to reflect instant booking.

4. **Loading state**: While the price is being fetched automatically, show a subtle loading spinner in the sidebar instead of nothing.

### New Sidebar Flow (visual)

```text
[Guests: - 2 +]

[Check-in:  May 27, 2026]
[Check-out: May 31, 2026]
4 nights

--- Price Breakdown ---
Accommodation (4 nights)    $X,XXX
Cleaning Fee                  $XXX
Total (USD)               $XX,XXX

[====== Book Now ======]   (gold, primary)
[--- Ask a Question ---]   (outlined, opens inquiry popup)
```

### Technical Details

- Import `InquiryDialog` from `@/components/InquiryDialog` into `Book.tsx`
- Use `useEffect` to trigger `fetchQuote()` whenever `checkIn`, `checkOut`, or `guests` change (debounced to avoid rapid calls if guest count is adjusted quickly)
- Remove the manual "Get Quote" button (lines 324-334 in current Book.tsx)
- Add the "Ask a Question" button wrapped in `<InquiryDialog><button>Ask a Question</button></InquiryDialog>` below the "Book Now" button
- No edge function changes needed -- the quote endpoint and checkout redirect work the same way

### Files Modified

- `src/pages/Book.tsx` -- auto-fetch quote, remove "Get Quote" button, add inquiry button, update copy
