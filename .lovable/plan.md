# Fully Editable Reservations + Re-shareable Link

## Goal
Any saved reservation can be opened and edited exactly like a new booking — change guest/dates, add or remove services, adjust quantities/prices, accommodation, tip and card fee. The same payment link automatically reflects the changes, with a one-tap "Generate new link" option and a clear warning when editing a booking that's already been paid.

## How it works today (and the gaps)
- **All Bookings** has a cramped inline editor: it only edits existing line items' qty/price, dates, tip and the card-fee toggle.
- You **cannot** add a new service, remove a line, or change accommodation fare/currency or exchange rate while editing.
- The payment link already reads live data, so edits *do* reach the guest — but there's no obvious "copy/re-send" step after editing and no way to retire an old link.
- The backend already permits updating every booking field (including the link token), so no security/permission changes are needed.

## What will change

### 1. Shared booking form (create + edit)
Refactor the New Booking form into a single reusable form used for both creating and editing:
- Full service picker with **add line / remove line**, quantity and price editing, accommodation fare + currency + exchange rate, tip mode/value/method, card-fee toggle, cash collected — identical to creating a booking.
- When opened in edit mode it is pre-filled with the reservation's saved values.
- Live totals recompute as you type (services subtotal, included 5% gratuity, 5% card fee, grand total).

### 2. Edit entry point in All Bookings
- The **Edit** button on each reservation opens this full form (replacing the limited inline editor) pre-loaded with everything.
- **Save Changes** writes the update and recomputes all stored totals. The existing link keeps working and now shows the new amounts.

### 3. Link handling after edit
- After saving, the reservation shows its payment link with **Copy link** so it can be re-sent immediately.
- A **Generate new link** action creates a fresh link token and retires the old one (old URL stops working) — for cases where you want to be certain the guest uses the corrected invoice.

### 4. Paid-booking safety
- If a reservation is already marked **paid**, opening it to edit shows a clear inline warning ("This reservation was already paid — changing totals may cause a mismatch with what the guest paid"). Editing is still allowed per your choice.

## Technical notes
- Extract the form body of `src/pages/concierge/NewBooking.tsx` into a shared `BookingForm` component taking an optional `initialBooking`; `NewBooking` becomes a thin wrapper. `AllBookings` renders it for edits.
- Save path: `conciergeDb.bookingsInsert` for new, `conciergeDb.bookingsUpdate(id, patch)` for edits — both already exist in `src/lib/conciergeApi.ts`.
- "Generate new link" sets a new `pay_token` (via `crypto.randomUUID()`) through `bookingsUpdate`; the `/pay` page and `guest-payment-get` already resolve by token, so the old token simply stops matching. No edge-function changes required.
- Totals reuse the existing helpers in `src/lib/calculations.ts`; no pricing-rule changes.
- Remove the old inline-edit markup in `AllBookings.tsx` to avoid two divergent editors.

## Out of scope
- No changes to pricing rules, the guest payment page layout, or Stripe flow.
