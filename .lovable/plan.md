# Card Fee — Include Accommodation in the Base

## Why

Today the 5% card fee is calculated only on the chargeable lines (experiences + UTV fuel + included gratuity + card tip). Accommodation is excluded because it's paid via Guesty, not on the card. That's why $1,000 USD accommodation produced just a $40 MXN fee — the fee was 5% of the $800 MXN gratuity only.

You chose: **the card fee should include the accommodation amount**. With $16,000 MXN accommodation + $800 MXN gratuity, the fee becomes 5% × $16,800 = **$840 MXN**.

## Change

Update the card-fee base everywhere so it equals:

```text
feeBase = accommodationMXN + upsells + UTV fuel + included gratuity + card tip
cardFee = 5% × feeBase
```

The grand total charged to the guest stays the same line structure; only the fee line grows.

Note: accommodation itself is still NOT a charged line — it remains context/gratuity base. Only the card *fee* now counts it.

## Where (single source of truth + the two server copies that must match)

1. `**src/lib/calculations.ts` — `computeGuestPayment**`
  - Change `chargeable` (the fee base) to add `accommodationMXN`.
  - Keep `total = upsells + gas + gratuity + tip + fee` (total must not double-count accommodation — accommodation is only in the fee base, not added as a charged line).
  - This drives the concierge Booking Summary in `NewBooking.tsx`.
2. `**supabase/functions/guest-payment-checkout/index.ts**`
  - Recompute `fee` on `accommodationMXN + chargeable` so the Stripe charge matches.
  - The Stripe "Card processing fee (5%)" line item reflects the new amount; the other line items stay unchanged.
3. `**supabase/functions/guest-payment-get/index.ts**`
  - This function returns `feeRate` and the raw values; the guest `/pay` page computes the fee client-side. Confirm the guest page (`src/pages/GuestPayment.tsx`) applies the fee to a base that includes `accommodationMXN`, so the displayed total matches checkout.

## Verification

- $1,000 USD accommodation @ 16, no services → fee = $840 MXN, total guest charge = $1,640 MXN ($800 gratuity + $840 fee).
- Confirm concierge Booking Summary, guest `/pay` page, and Stripe checkout all show the same total.

## Out of scope

- No change to gratuity rate, markup rules, profit math, or owner statement.  
  
  
i also want you to redesign to new bookingpage, ffeels like patch work. rethink the layout and where the fees go