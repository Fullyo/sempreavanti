# Concierge: In-Month Booking Creation + Unified Bottom Summary

## Goal
1. Remove the standalone **New Booking** tab from the top navigation. Booking creation moves inside the month view.
2. When a month is opened, show an **Add New Booking** action at the top of that month; clicking it opens the booking form inline (check-in left blank for the concierge to enter).
3. Redesign the per-month financial summary into one cohesive black block, shown only at the **bottom** of the opened month (never at the top).

## 1. Remove the top "New Booking" tab
In `src/pages/concierge/Concierge.tsx`:
- Remove the `{ id: "new", label: "New Booking" }` entry from `TABS`.
- Change the default active tab from `"new"` to `"all"`.
- Remove the `{tab === "new" && <NewBooking .../>}` render line (the `NewBooking` import there is no longer needed).

The remaining tabs become: All Bookings · Price List · Export · Settings.

## 2. Add-booking button at the top of an open month
In `src/pages/concierge/AllBookings.tsx`, inside the `isOpen` section (currently opens with the KPI summary at the top around line 484):
- Add local state `const [adding, setAdding] = useState(false)` (reset when the open month changes).
- At the **top** of the open month body, render an **+ Add New Booking** button (`btnPrimary`).
- When clicked, render the `NewBooking` form inline (same wrapper styling already used for editing, around line 711), with:
  - `onSaved={() => { setAdding(false); load(); }}`
  - `onCancel={() => setAdding(false)}`
- Check-in is left blank; the concierge enters the full date. (`NewBooking` already defaults `checkin` to empty, so no prop change is needed.)

This makes the flow: open August → click **Add New Booking** → fill in the form → save.

## 3. Move + redesign the month summary (single black block, bottom only)
Currently the summary (`KpiBlock` ×3–4 + note) renders at the **top** of the open month (lines ~484–541), and `PettyCashSummary` renders at the bottom (line 862).

Changes:
- **Remove** the KPI summary group from the top of the open month.
- **Create one unified dark summary component** (e.g. `MonthSummary`) rendered at the very bottom of the open month, after all booking rows (replacing/absorbing the current `PettyCashSummary` slot at line 862).
- The block is a single cohesive panel on the dark background (`#1C1914`, gold `#B8924A` accents, cream `#F7F4EE` text — matching the existing dark `combined` KpiBlock and PettyCashBox styling), internally divided into labelled sub-sections separated by hairline dividers:
  1. **Accommodation Fare (USD)** — Total Fare · Owner 85% · LUX 15%
  2. **Upsells (pesos, billed USD @16)** — Guest Billed · Profit Pool · Owner 85% · LUX 15% (with USD sub-lines)
  3. **Combined Totals (USD)** — Bookings · Owner Total Earnings · LUX Total Cut
  4. **Commissions Owed** — only when `> 0`
  5. **Petty Cash** — Total Given · Spent · Remaining (per currency), folding in the current `PettyCashSummary` logic
- Keep the existing footnote ("Accommodation is billed in USD… charged in USD at 16") inside the block.
- The June 2026 "Special Reconciliation" card and per-guest booking rows stay where they are (unchanged).

All figures come from the existing `computeMonthKpis` result and `petty` map — no calculation logic changes, only layout/placement.

## Technical notes
- Reuse existing color tokens from `./styles` (`COLORS`) and the dark palette already used by `PettyCashBox`/`combined` tone.
- `computeMonthKpis`, FX handling, and owner/LUX split math are unchanged.
- No database, edge function, or schema changes.

## Files changed
- `src/pages/concierge/Concierge.tsx` — remove New Booking tab + default to All Bookings.
- `src/pages/concierge/AllBookings.tsx` — add-booking button inside month, move summary to bottom, new unified dark `MonthSummary` block (absorbing `PettyCashSummary`).
