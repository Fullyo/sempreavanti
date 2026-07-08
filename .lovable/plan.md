# June 2026 Owner ⇄ LUX Reconciliation Note

## Goal

Record the June reconciliation as a persistent, visible note in the concierge All Bookings June view, so the dual-system upsell split is documented for the month.

## The confirmed calculation

June ran two systems:

- **Old system** (owner collected upsells): Perez, Lau, Couri, Castellanos
- **New system** (LUX collects all upsells): Julie, Shannon, Eric

**A. Owner owes LUX — 15% management fee on ALL accommodation (USD)**

- Total accom fare: $32,172.92 USD → × 15% = **$4,825.94 USD**

**B. Owner owes LUX — LUX's 15% of OLD-system upsell profit (USD)**

- Old upsell profit: $627.66 USD → × 15% = **$94.15 USD**

**C. LUX owes Owner — owner's 85% of NEW-system upsell profit (MXN)**

- New upsell profit: $26,852 MXN → × 85% = **$22,824.20 MXN**

**Settlement (two currencies, no netting):**

- Owner owes LUX: **$4,920.09 USD** (A + B)
- LUX owes owner: **$22,824.20 MXN** (C)

## What will be built

Add a "June Reconciliation" summary card to the June month view in `src/pages/concierge/AllBookings.tsx`:

1. A clearly labeled note block, shown only for the `2026-06` folder, containing:
  - The two-system explanation (which guests are old vs new).
  - Section A (accom 15%, USD), Section B (old upsell 15%, USD), Section C (new upsell 85%, MXN).
  - Final two-line settlement: Owner owes LUX `$4,920.09 USD`; LUX owes owner `$22,824.20 MXN`.
2. Figures derived in code from the existing June bookings (historical + live) rather than hardcoded totals where practical, with the split rule applied:
  - Old-system rows (historical June) → LUX gets 15% of upsell profit.
  - New-system rows (Julie/Shannon/Eric live) → owner gets 85% of upsell profit.
  - All accom fares → 15% to LUX.
3. Keep USD and MXN separated per the currency-display rule (no forced netting).

## Technical notes

- Old vs new classification: historical June bookings (`JUNE_2026_BOOKINGS` in `historicalData.ts`) = old system; live DB bookings ids 3–6 (Julie, Shannon, Eric) = new system.
- Accom fares are USD; live upsell profit is MXN; historical upsell profit is USD — keep them in their native currency, matching the existing multi-currency KPI logic already in `AllBookings.tsx`.
- No schema/database changes. Presentation-only addition to the June view.

## Out of scope

- April/May views unchanged.
- No changes to guest payment or Stripe flows.
- No netting/conversion of the two settlement figures into a single number.  
  
perfect make sure to inclde the names of the guests for ols vs new system in June in this special reconsilation note
- &nbsp;