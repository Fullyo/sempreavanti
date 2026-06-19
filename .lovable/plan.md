# Fix the guest payment-link tip calculation

## The problem
The custom tip and the 10/15/20% presets are treated as a **floor** against the concierge-agreed tip (e.g. Julie's $4,800), not as an amount added on top. So:
- Typing a custom amount below/near the agreed tip shows almost nothing as "Additional tip" (your 5000 → $200).
- The percent presets quietly subtract the agreed tip, so the displayed "additional" isn't actually 10% of anything obvious.

The agreed tip should be its **own always-included line**, and the percent/custom amounts should be **purely additive on top of it**. The page should also clearly state what the % is calculated from.

## What "the rule" is (for transparency in the UI)
Percent is calculated on the **gratuity base = accommodation fare (converted to MXN) + all experiences/upsells + UTV gas** — the same base used for the included 5% gratuity. This holds even when the 5% is waived (Julie's case) and even when a tip was already left.

## Changes

### 1. `src/pages/GuestPayment.tsx` (logic + display)
- Make the extra tip additive instead of a floor:
  - `additionalTip` = the requested amount directly:
    - percent → `Math.round(gratuityBase * tipPct/100)`
    - custom → `customCurrency === "USD" ? customAmount * fx : customAmount`
  - `tip` (total card tip) = `agreedTip + additionalTip`.
  - Remove the `Math.max(agreedTip, requestedTip)` floor logic.
- Show the calculation basis under the preset buttons, e.g.:
  - "Calculated on accommodation + experiences ($75,484 MXN)."
  - For a selected percent, show the live computed amount ("10% = $7,548 MXN").
- Keep the existing custom MXN/USD toggle and the "= $X at the booking rate" helper for USD.
- "Additional tip" row now reflects exactly what was entered/selected (no subtraction).
- Totals section already lists Experiences, included gratuity (when not waived), "Tip agreed with concierge", "Additional tip", and card fee — these now stay consistent because `tip = agreedTip + additionalTip`.

### 2. `supabase/functions/guest-payment-checkout/index.ts` (server recompute — must match)
- Replace `const tip = Math.max(agreedTip, requestedTip)` with `const tip = agreedTip + requestedTip`.
- Keep `requestedTip` computed server-side from `tipMode`/`tipValue`/`tipCurrency` (percent of `gratuityBase`, or MXN/USD amount). This keeps the charge trustworthy and identical to what the guest saw.
- Redeploy the function after the edit.

## Notes
- No schema changes. `agreedTip` still comes from `guest_tip ?? tip`; cash tip stays info-only.
- After deploy, verify with Julie's link: agreed $4,800 shows as its own line; typing custom 5000 MXN adds exactly $5,000 as "Additional tip"; 10% shows "$7,548" and adds it on top.
