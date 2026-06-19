# Card Fee — Exclude Accommodation From the Base

## Why

The 5% card fee was recently changed to include the accommodation fare in its base. That was wrong: the accommodation fare is paid out via Guesty, not on the card, so the guest should not pay a 5% processing fee on it. The fee must apply only to what is actually charged on the card.

## New rule

```text
feeBase = upsells + UTV fuel + included gratuity + card tip
cardFee = 5% × feeBase
```

Accommodation stays exactly where it was before: shown for context and used as the gratuity base — but NOT in the card-fee base.

## Where

1. **`src/lib/calculations.ts` — `computeGuestPayment`**
   - Change `feeBase` from `accommodationMXN + chargeable` back to just `chargeable` (`upsells + gas + gratuity + tip`).
   - `total = chargeable + fee` is unchanged.
   - Keep `accommodationMXN` in `gratuityBase` (gratuity still computed on accommodation + upsells + fuel — unchanged).

2. **`supabase/functions/guest-payment-checkout/index.ts`** (redeploy)
   - Recompute `fee` on `chargeable` only (drop `accommodationMXN` from `feeBase`). Stripe "Card processing fee (5%)" line shrinks accordingly.

3. **`supabase/functions/guest-payment-get/index.ts`** (redeploy)
   - No math change needed (it already returns `feeRate` + raw values), but confirm the guest page computes the fee on the non-accommodation base.

4. **Guest invoice / `/pay` page (`src/pages/GuestPayment.tsx`)**
   - Update the fee line label/note to state the card fee does not apply to the accommodation fare (already paid via Guesty).
   - Remove the "currency assumptions" explanatory text.

5. **Concierge Booking Summary (`src/pages/concierge/NewBooking.tsx`)**
   - Update the inline fee label so it no longer lists accommodation in the fee base.

## Verification

- $1,000 USD accommodation @ 16, no services, no tip → gratuity = 5% × $16,000 = $800 MXN; fee = 5% × $800 = $40 MXN; total = $840 MXN.
- Confirm concierge Booking Summary, guest `/pay` page, and Stripe checkout all show the same total.

## Out of scope

- No change to gratuity rate or base, markup rules, profit math, or owner statement.
