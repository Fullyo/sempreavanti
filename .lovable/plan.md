## Goal

Fix currency display and totals in the **All Bookings** month reports so nothing is jammed into a single wrong currency. The model, per your clarification:

- **Accommodation fare is always USD** (paid on Guesty in USD). Never converted to pesos.
- **Upsells are priced/charged in pesos**, but the guest pays in **USD converted at 16**. So every upsell figure is shown as **pesos charged → USD paid (@16)**.
- Applies to **June 2026 and everything moving forward**. April/May stay as they are.

## The bug today

`computeMonthKpis` (`src/pages/concierge/AllBookings.tsx`) adds historical USD figures and live MXN figures together raw, then the KPI strip formats the whole sum as USD whenever any historical booking exists (`hasHist ? formatUSD(...) : formatMXN(...)`). That's why June shows a peso profit pool ($26,852 MXN) added on top of $627.66 USD and labeled as one USD number. The individual booking math is fine; only the aggregation/labelling is wrong.

## Currency rules to apply

Exchange rate = **16** (existing project convention).

| Figure | Charged (peso) | Paid (USD) |
|---|---|---|
| Accommodation fare | — (n/a) | native USD |
| Upsell guest-billed | native peso | peso ÷ 16 |
| Upsell profit pool | native peso | peso ÷ 16 |

Data normalization so totals sum correctly:
- **Live bookings** (`Booking`): `total_guest`, `total_profit`, line items are already pesos → USD = ÷ `exchange_rate` (default 16). If `accommodation_currency === "MXN"`, convert that accom fare to USD ÷ rate; otherwise it's already USD.
- **Historical June bookings** (`historicalData.ts`): upsell figures are currently stored in USD → peso = × 16 for the "charged in pesos" display; accom fare already USD, left untouched.

## Changes

### 1. `src/pages/concierge/AllBookings.tsx` — `computeMonthKpis`
Return two clean dimensions instead of one blended number:
- `accommodation` → **USD only** (normalize any live MXN accom fares to USD before summing; historical already USD).
- `upsells` → both `chargedMXN` (peso) and `paidUSD` for billed, profit, owner 85%, LUX 15%.
- `combined` (Owner Total / LUX Total) → expressed in **USD** = accom USD + upsell USD-paid, so the two real currencies never get added raw.

### 2. Month KPI strip (the three cards in your screenshots)
- **Accommodation Fare** block: always `formatUSD(...)`. Remove the `hasHist ? USD : MXN` toggle.
- **Upsells** block: each value shows **pesos** as the primary figure with a **USD (@16)** sub-line — e.g. `$120,468.08 MXN` / `≈ $7,529.26 USD`. (Uses existing `formatMXN` / `formatUSD`.)
- **Combined** block: USD, labelled so it's clear it's accom USD + upsells paid in USD.
- Replace the current "not FX-converted — treat separately" warning note with a short legend: *Accommodation billed in USD · Upsells priced in pesos, charged to guests in USD at 16.*

### 3. Per-booking rows
- **Historical June rows** and **live MXN rows**: accom fare stays USD; upsell line-item table and totals show **pesos with the USD (@16) equivalent** as a sub-line, consistent with the KPI strip. April/May historical rows unchanged.

### 4. Verify totals
After the change, re-check June:
- Accommodation fare total = sum of the four June accom fares in USD (Perez 1,062.75 + Lau 1,615.25 + Couri 7,343.00 + Castellanos 2,656.00 + the four live accom fares normalized to USD).
- Upsells: peso total and its ÷16 USD total tie out to the per-booking line items.
- Confirm the KPI strip, combined block, and per-booking rows all agree.

## Out of scope
- No database or schema changes; display/aggregation logic only.
- April & May reports and their existing USD figures stay as-is.
- No changes to the guest payment page or Stripe flow.
