# Fix: May bookings showing under April / May empty

## Diagnosis

I verified the actual data and grouping logic in the repo:

```text
2026-05  7  Maxim, Jose Izquierdo, Diego Alatorre, Teresa, Christopher Jackson, Gustavo Dominguez, Abril García
2026-04  6  Jess Geevarghese, Michael Orcutt, Dan Warneke, Scott Strannigan, Erikk Pietro, Alem Sendaba
```

- All 7 May reservations carry `monthKey: "2026-05"`, so they bucket into the May folder.
- The "Open Full May 2026 Report" button is tied to the `2026-05` folder, and the April report to `2026-04`.

The screenshots (May empty, April holding 7 bookings + a May report button) reflect an **older build** — the current source cannot produce that layout. There is no remaining data or logic bug; the preview simply needs to reload the latest module.

## Plan

1. Restart the dev server so the preview serves the current `historicalData.ts` / `AllBookings.tsx` modules.
2. Hard-refresh the Bookings page and confirm:
   - May 2026 folder shows 7 bookings (the current month, no longer empty).
   - April 2026 folder shows 6 bookings.
   - Each folder's "Open Full Report" button matches its own month.
3. If after refresh it still shows the old layout, add a small console log of the computed `displayMonthSections` keys/counts to capture the live state and pinpoint any environment-specific caching.

## Technical notes

- No source changes are required for the split itself; the `monthKey` overrides in `src/pages/concierge/historicalData.ts` already control folder placement.
- Step 3's temporary logging would go in `AllBookings.tsx` near `displayMonthSections` and be removed once confirmed.
