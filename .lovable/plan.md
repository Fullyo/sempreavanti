## Goal

Make the May 2026 accommodation fare total identical on both pages, equal to the verified sum of the seven per-booking room-only fares: **$30,451.20**.

## Verified source of truth

Sum of the seven room-only accommodation fares (matches the line items printed in the report):

```text
Maxim          12,493.00
Izquierdo       3,245.00
Teresa          1,600.00   (room-only, not the 2,223 folio-with-upsells)
Jackson         8,743.00
Dominguez       1,971.05
Alatorre          973.05
García          1,426.10
              ──────────
TOTAL          30,451.20
```

- LUX accommodation cut (15%): **$4,567.68**
- Owner accommodation share (85%): **$25,883.52**

## Bug 1 — All Bookings overview (`src/pages/concierge/historicalData.ts`)

- Teresa's `accommodationFare` is `2223.00` (her folio total including upsells). Change it to `1600.00` (room-only), matching the report's own line item and the previously agreed figure.
- Update Teresa's `notes` to clarify `$1,600 room-only · folio $2,223 incl. upsells` so the basis is documented.
- Result: the overview accommodation total recomputes from $31,074.20 to **$30,451.20**.

## Bug 2 — Full May report header (`src/pages/concierge/may2026Historical.ts`)

The header and grand summary are hardcoded to $31,830.05, which matches neither the overview nor the report's own line items. Correct them to the verified totals:

- Top "Accommodation Fare" card: `$31,830.05` → `$30,451.20`
- Grand Summary "Accommodation Fare": `$31,830.05` → `$30,451.20`
- "LUX cut breakdown" line: accommodation portion `$4,774.51` → `$4,567.68`; recompute LUX total = `$787.93` (upsells) + `$4,567.68` = `**$5,355.61**`
- Top "LUX Total Cut" card: `$5,562.44` → `$5,355.61`
- Grand Summary "LUX Total Cut": `$5,562.44` → `$5,355.61`

The per-booking accommodation line items (the seven `accom-bar` blocks) are already correct and stay unchanged.

## Out of scope / unchanged

- Upsell profit pool ($5,434.75) and the petty-cash $181.88 deduction logic — already reconciled in prior work, not touched.
- Live (MXN) booking calculations and other months.

## Verification

- Re-sum the seven accommodation line items in the report → must equal $30,451.20.
- Open All Bookings overview for May and confirm the accommodation KPI reads $30,451.20.
- Confirm the report header card, Grand Summary, and LUX breakdown all read the same derived figures.  
  
  
i am approving but tell me if this is a drop in coommison revneu for LUX or again?
- &nbsp;