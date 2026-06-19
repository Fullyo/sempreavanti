# Fix tip currency bug + mixed-currency cash tips

## Background

Two real problems surfaced on Julie Lobley's booking:

1. **Phantom card tip / inflated total.** The agreed credit-card tip is stored twice: as a canonical pesos value (`tip` = 4,800) and as raw input (`tip_value` = 4,800 + `tip_currency` = USD). On reload the editor recomputes `tip_value × exchange_rate` (4,800 × 16 = $76,800), inflating the preview total to $99,707. The amount Julie actually paid ($24,107) was correct — only the on-screen recompute is wrong.

2. **Cash tip can't hold two currencies.** Julie left 200 USD **and** 2,000 MXN in cash, but the form has a single amount + single currency, so only the 200 USD ($3,200) was recorded and the 2,000 pesos was lost.

## What to build

### 1. Stop the double-conversion of the agreed card tip

In `src/pages/concierge/NewBooking.tsx`, the editable tip input must never be re-multiplied from a value that is already converted.

- When loading an existing booking, initialize the editor from the canonical pesos value and treat it as MXN:
  - `tipValue` ← `initialBooking.tip` (already-converted MXN), `tipCurrency` ← `"MXN"`.
- Keep the live entry behavior unchanged: when a concierge types a fresh USD amount, it still converts once on save.
- This guarantees the agreed card tip displays as $4,800, the 5% fee is computed on the real base, and the total is correct.

Apply the same canonical-MXN reload logic anywhere else that re-derives the tip from `tip_value`/`tip_currency` (verify `GuestInvoicePDF.tsx` and the guest `GuestPayment.tsx` / `guest-payment-get` path, which already read the canonical `tip`/`guest_tip`).

### 2. Mixed-currency cash tip

Allow the concierge to record cash left in **both** USD and MXN.

- Add two cash inputs in the "Tips & Adjustments" section: "Cash — USD" and "Cash — MXN".
- Total recorded cash (pesos) = `usdCash × fx + mxnCash`.
- This total continues to flow into the existing `tip_cash` field (info-only, never charged, never part of profit), shown in the invoice as "Cash tip to staff (tracked separately)".

### 3. Data correction for Julie (booking id 3)

After the code fix, normalize her record so the screen reads correctly:
- `tip_value` = 4800, `tip_currency` = `MXN` (canonical; charged amount unchanged at $4,800).
- Cash: 200 USD + 2,000 MXN → `tip_cash` = `200×16 + 2000 = 5,200` MXN, with the new component fields populated.
- Leave `tip`, `guest_tip`, `amount_paid` ($24,107), and `payment_status = paid` untouched — the charge was correct.

## Technical details

- **Schema (migration):** add `tip_cash_usd numeric default 0` and `tip_cash_mxn numeric default 0` to `bookings` to store the two raw cash components; keep `tip_cash` as the derived MXN total for backward compatibility. (`tip_cash_value`/`tip_cash_currency` become legacy single-currency fields.)
- **Data fix:** done via the data-update (insert) tool, not a schema migration.
- **Files:** `src/pages/concierge/NewBooking.tsx` (load logic + cash inputs + save payload), `src/pages/concierge/GuestInvoicePDF.tsx` (verify it reads canonical `tip` and the new cash total), and a quick check of `supabase/functions/guest-payment-get/index.ts` (already canonical).
- **No change** to `guest-payment-checkout` tip math — it already uses canonical `guest_tip`/`tip` plus guest-added extra.

## Verification

- Reload Julie's booking: card tip shows $4,800, total guest charge ≈ $24,107, cash tip shows $5,200.
- Create a new test booking entering card tip in USD, save, reload — value stays stable (no ×16 inflation).
- Enter cash as 200 USD + 2,000 MXN — recorded total = $5,200.
