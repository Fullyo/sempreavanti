## Goal

Make `src/pages/concierge/NewBooking.tsx` flawless and fully responsive so the concierge can create and edit complete bookings from a phone. Fix the cramped Unit Price cell, hide QTY where it's meaningless, and make every section reflow cleanly on mobile.

This is presentation-only work in `NewBooking.tsx` (plus the existing `useIsMobile` hook). No calculation, schema, edge-function, or financial-logic changes — all math (`calcGuestTotal`, `calcCost`, `calcProfit`, gratuity, 5% card fee excluding accommodation, profit) stays exactly as-is.

## 1. Hook up responsiveness

- Import the existing `useIsMobile` hook (`@/hooks/use-mobile`, 768px breakpoint).
- Use it to switch between the desktop grid and the mobile stacked-card layout for: the guest-info block, the accommodation row, the services table, and the Tips & Adjustments grid.

## 2. Service rows — desktop

- Widen and rebalance the columns so Unit Price has real room. Give the price input its own line under the service name on narrower widths, and stop forcing the MXN/USD toggle to share a 140px cell with the input.
- Keep columns: Service · Qty · Unit Price (+ currency) · Our Cost · Guest Total · Your Profit · remove.
- For QTY-less types (`grocery`, `minibar`, `flat`, `fixedprofit`), render the Qty cell as a static "—" (locked to 1) instead of an editable input, and relabel the price placeholder appropriately (e.g. "Total cost paid" for groceries/mini bar).

## 3. Service rows — mobile (stacked cards)

Each service becomes a self-contained card with full-width, clearly labeled fields:

```text
┌─────────────────────────────┐
│ Service           [ remove ×]│
│ [ service picker (full)     ]│
│ Unit Price        Qty        │
│ [____] [MXN|USD]  [__] (hide │
│                    if locked)│
│ Guest Total: $X,XXX          │
│ ▸ Cost & profit  (collapsed) │
└─────────────────────────────┘
```

- Unit Price input full-width with the currency toggle beside/below it — never cramped.
- QTY field shown only for quantity-based types; hidden for grocery/mini bar/flat/fixed-profit.
- Guest Total always visible.
- **Our Cost** and **Your Profit** collapse behind a tappable "Cost & profit" disclosure (collapsed by default on mobile); expanding one row reveals its cost and profit. Desktop keeps them always visible.
- The auto UTV-fuel line gets the same card treatment (editable rate per unit, read-only totals).

## 4. Other sections — mobile reflow

- **Guest info** (`2fr 1fr 1fr`) → single column on mobile; check-in/check-out can sit side-by-side.
- **Accommodation row** (`2fr 1fr 2fr`) → stacked; commission helper text wraps below.
- **Tips & Adjustments** (`repeat(2,1fr)`) → single column on mobile so each amount + currency toggle has full width.
- **Guest Invoice** dark panel and the saved-link share panel: ensure rows wrap, the link input and Copy/Generate buttons stack instead of overflowing, and the 5% card-fee row's amount + Remove/Add button wrap cleanly.
- Reduce large fixed paddings (22–28px) on mobile so content isn't squeezed.

## 5. Verify

- Run a Playwright pass at mobile width (375px) and desktop width against the concierge New Booking route: add a grocery line (confirm no QTY field, "total cost paid" placeholder), add a tour with qty, add a UTV (confirm auto-fuel card), expand the mobile cost/profit disclosure, and screenshot each state.
- Confirm Guest Total / profit / total guest charge numbers are identical to the current behavior (layout change only).
- Confirm edit mode loads all fields into the new layout and saving still works.

## Out of scope

No changes to markup/profit formulas, gratuity rate, the 5% card-fee rule (already excludes accommodation), the 85/15 split, petty cash, reports, or any edge function.