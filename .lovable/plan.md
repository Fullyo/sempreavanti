# One Workspace: Reservations become Bookings

## Goal

Kill the separate **Reservations** tab. Every Guesty stay lands directly in **All Bookings** as a booking that is *already created* — guest name, villa, dates, accommodation fare (room-only, USD), and the meal-planner link all pre-attached. The concierge never starts from a blank form; she opens the guest that's already there and edits/adds the upsells. All 12 months of 2026 live on one page; 2027 starts fresh next year.

## How it works for the concierge

- **All Bookings** shows the 2026 months, current month first, exactly like today.
- Opening a month shows every guest for that month — auto-populated from Guesty — each as a booking card.
- Each card already has: guest, villa, check-in → check-out, nights, the **accommodation fare** (draft, room-only USD, editable), and the **meal-planner link** (Copy / Open).
- She clicks a booking to **edit** it: add/adjust upsells, tips, grocery allocation, etc. She never re-types the guest name or the fare.
- A guest not in Guesty (off-platform / whole-property) can still be **added manually** with the existing New Booking form.
- **Refresh from Guesty** button moves onto the All Bookings page.
- April / May / June stay exactly as they are — frozen historical reports, untouched.

## The accommodation fare

Guesty exposes a room-only figure (`money.fareAccommodation`) that is separate from the folio total. The sync pulls **only that** field (never the folio total), stores it as a draft USD fare on the booking. The concierge can still correct it. This directly avoids the folio-vs-room-only mistake we hit for May.

## Data model

Make `bookings` the single source of truth and retire the separate `reservations` table from the UI.

Add to `public.bookings`:
- `guesty_id` (text, unique when present) — links a booking to its Guesty stay; null for manual bookings.
- `meal_token` (uuid, default gen_random_uuid()) — the guest meal-planner link.
- `listing_name` (text), `nights` (int), `res_status` (text) — stay metadata.
- `source` (text, default `'manual'`; `'guesty'` for synced) — origin.

Migration also backfills: for each current `reservations` row, insert/merge a matching `bookings` row (carrying over its `meal_token` so existing meal-planner links keep working).

## Sync behavior (guesty-reservations-sync)

- Request the extra field `money.fareAccommodation` (+ its currency) from the Guesty API alongside the existing fields.
- Upsert into `bookings` keyed on `guesty_id`:
  - **On insert:** set guest, checkin, checkout, nights, listing_name, res_status, `accommodation_fare` (from `fareAccommodation`), `accommodation_currency='usd'`, `source='guesty'`, fresh `meal_token`.
  - **On update:** refresh only Guesty-owned fields (dates, status, guest, nights, listing). Never overwrite concierge-entered upsells, tips, grocery, or a fare she has edited.
- Cancelled Guesty stays flip `res_status` to `cancelled` (shown greyed, not deleted, so entered upsells aren't lost).

## Meal planner

The public `/meals/:token` planner and its `meal-plan` edge function get repointed to look up the token on `bookings.meal_token` (backfilled to match existing tokens), so no guest link breaks.

## UI changes

- `src/pages/Concierge.tsx` — remove the "Reservations" tab.
- Delete `src/pages/concierge/Reservations.tsx`.
- `src/pages/concierge/AllBookings.tsx`:
  - Move the "Refresh from Guesty" action here.
  - Render each month's Guesty bookings as editable cards with the Copy/Open meal-link buttons.
  - Keep month navigation, historical months, KPIs, and currency display rules unchanged.
- `src/pages/concierge/NewBooking.tsx` — reused as the edit form for a pre-created booking (guest + fare pre-filled, editable); still usable to add a manual booking.

## Out of scope (unchanged)

- April/May/June historical reports and their math.
- Currency conventions (accommodation USD, upsells MXN @16), tip logic, UTV upkeep, grocery allocation, KPI formulas.

## Technical notes

- One migration for the `bookings` columns + backfill from `reservations`.
- `concierge-db` already exposes bookings list/insert/update/upsert — extend its allowed field list for the new columns.
- After the model is proven, the `reservations` table can be dropped in a later cleanup; this plan leaves it in place (dormant) to be safe.
