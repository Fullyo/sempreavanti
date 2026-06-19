# Go-Live Review & Fixes — Concierge Booking + Guest Payment

Full money-path review is done. The card-fee rule (excludes accommodation, keeps gratuity on accommodation) is already consistent across the concierge screen, the `/pay` page, the Stripe checkout, and the PDF invoice. This plan fixes the remaining go-live risks before real guests use it.

## 1. Sync real paid amounts back from Stripe (the critical one)

**Problem:** A guest can raise the tip on the `/pay` page. Stripe charges the higher amount, but the webhook only saves `guest_tip` / `amount_paid` — it never updates `tip`, `cc_fee`, or `total_guest`, which are the fields the Owner Statement and booking list actually read. Result: the "Tips to send to staff" figure and booking totals can be lower than what the guest really paid, shorting staff.

**Fix — `supabase/functions/stripe-webhook/index.ts`:** on `checkout.session.completed`, in addition to the current fields, also write from the session metadata (already sent by checkout):

```text
tip         = metadata.tip      (actual tip charged, MXN)
cc_fee      = metadata.fee      (actual card fee, MXN)
total_guest = metadata.total    (actual grand total, MXN)
tip_mode    = "amount"          (so the report label can't show a stale "%")
tip_value   = metadata.tip      (keep label truthful)
```

After this, every report reflects what the guest actually paid, not the concierge's pre-set estimate. Unpaid bookings keep showing the concierge's estimate (unchanged).

## 2. Clean up owner-facing report labels & KPI definitions

**a. Stale card-fee wording — `src/pages/concierge/ownerStatement.ts`**
- Change the row label `Credit Card Fee (5% on total)` → `Credit Card Fee (5%, excludes accommodation)` so it matches the real rule.

**b. KPI "Upsells → Guest Billed" overstated — `src/pages/concierge/AllBookings.tsx` (`computeMonthKpis`)**
- Today `liveBilled` uses `total_guest`, which bundles gratuity + tip + card fee into "upsell revenue." Change it to sum line-item `guest_total` only (matching the Owner Statement's "Upsell Revenue" and the historical figures). The gratuity/tip/fee remain visible where they belong (booking rows + statement footer), but stop inflating the upsell KPI.

This gives the owner one consistent definition of upsell revenue across the month KPIs and the Owner Statement.

## 3. Confirmed-correct, no change needed

These were verified during review and are working as intended:
- **Edit mode** reloads every field (services, currencies, fuel rate, tips, accommodation, FX) and re-saves correctly; the same pay link auto-reflects updated totals.
- **Already-paid protection:** the checkout function returns 409 and won't re-charge a paid link.
- **PDF invoice** uses the same `computeGuestPayment` engine as the `/pay` page, so they always match.
- **Gratuity on accommodation** stays (per your confirmation) — a guest with no experiences still pays the 5% gratuity computed on the room fare.

## Where the concierge gets the guest link
Two places, no change:
1. After saving a booking, the dark panel shows the link with a **Copy link** button.
2. On every booking row in **Bookings**, the **Copy Payment Link** button. Link format: `/pay/<token>`.

## Verification after build
- Simulate a paid booking where the guest tips more than the preset; confirm the booking row, Owner Statement "Tips to staff," and `total_guest` all reflect the higher actual amount.
- Re-open the May/April reports and a current-month live booking; confirm "Upsell revenue" matches between the month KPI and the Owner Statement.
- $1,000 USD accommodation @16, no services, no tip → gratuity $800, fee $40, total $840 across concierge, `/pay`, and PDF.

## Out of scope
No changes to gratuity rate, markup/profit formulas, the 85/15 split, or petty-cash logic.