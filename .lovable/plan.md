# Fix reservation cards: show accommodation fare + remove duplicates

## 1. Display accommodation fare on every reservation card
In `src/pages/concierge/AllBookings.tsx`, each card currently shows guest, listing, check-in/out, upsell total, profit and the services table — but no accommodation fare.

Add an accommodation fare line directly under the check-in/check-out row:

```text
Villa Pietro · Check-in: 2026-07-07 · Check-out: 2026-07-11 · 4 nights
Accommodation: $1,596 USD          [Edited]
```

Details:
- Value comes from `accommodation_fare` (always USD — never converted to pesos).
- Show an amber **"Edited"** badge when `accommodation_fare` differs from `guesty_fare` (manual override), matching the badge convention already used in `NewBooking.tsx`.
- If no fare is present, show `Accommodation: — USD` so the field is always visible for an easy overview.

This is a presentation-only change; no calculation logic is touched.

## 2. Delete the two duplicate placeholder bookings
Remove the old manually-seeded rows whose fabricated Guesty IDs no longer match the live Guesty reservations (so the sync created fresh rows and left these orphaned):

| Deleted (placeholder) | Kept (real Guesty) |
|---|---|
| Sara · Villa Pietro · Jul 7–11 · $1,996 (id 27) | Sara Ammar · Villa Pietro · Jul 7–11 · $1,596 (id 28) |
| Alex · Villa Luisa · Jul 4–11 · $4,650 (id 25) | Alexis Munger · Villa Luisa · Jul 6–11 · $3,320 (id 26) |

Done via a data delete on the `bookings` table for ids 25 and 27.

## Technical notes
- Card fare line added inside the guest/date block in `AllBookings.tsx` (around the check-in/out span).
- "Edited" badge condition: `accommodation_fare != null && guesty_fare != null && Number(accommodation_fare) !== Number(guesty_fare)`.
- Deletion uses the data tool (`DELETE FROM bookings WHERE id IN (25, 27)`), not a schema migration.
- Future duplicates from the same cause are already prevented because the sync upserts on the real `guesty_id`; these two were pre-existing orphans only removable manually.
