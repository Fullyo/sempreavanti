# Make gratuity optional & guest-controlled

## Goal
The 5% is no longer a mandatory gratuity. On the guest payment link it becomes a **pre-selected tip default** the guest can change or fully remove. Presets are **5% / 10% / 15% / 20%**, with 5% selected by default. Clicking the currently-selected preset **deselects it → no tip**. Guests can also enter a straight cash amount in **USD or MXN**. The percentage is always calculated on **accommodation fare + all upsells** (matching today's base).

## Behavior on the guest payment link (`/pay/:token`)
- On load, **5% is selected** and reflected in the running total.
- Preset row: `5%` `10%` `15%` `20%` `Custom`.
  - Tapping a non-selected percent selects it.
  - Tapping the already-selected percent **turns it off** (tip = 0).
  - `Custom` reveals the amount field with an MXN / USD toggle (already exists).
- No separate "Included gratuity (5%)" line anymore — there is a single **Tip** line that reflects the guest's current choice (0 if they opted out).
- Copy on the gratuity card changes from "a base 5% gratuity is included" to an invitation to tip, noting the default is 5% and can be removed.
- Card processing fee (5%) still applies to the charged lines (upsells + fuel + tip), never to accommodation. Unchanged.

## Concierge side
- **Remove the "waive 5% gratuity" toggle** from the booking form.
- **Remove the concierge-agreed tip floor**: the guest link no longer treats a pre-set tip as a minimum. The tip on the link is entirely the guest's choice.
- The invoice card / CSV export stop showing a separate "5% Gratuity" pass-through line; they show the actual tip the guest ended up paying (from the payment record) instead.

## Technical details

**`src/lib/calculations.ts`**
- `TIP_PRESETS` → `[5, 10, 15, 20]`.
- In `computeGuestPayment`: drop the mandatory `gratuity` term. Tip becomes the single guest-selected value (percent of `gratuityBase` = accommodation + upsells + gas, or a custom MXN/USD amount). `chargeable = upsellsSubtotal + utvGas + tip`; fee on that; keep accommodation out of the charge. Keep `GUEST_GRATUITY_RATE = 0.05` only as the default-selected preset value (rename usage to a default-tip constant for clarity).

**`supabase/functions/guest-payment-get/index.ts`**
- Stop returning a computed mandatory `gratuity`/`gratuityWaived`. Return the base (`accommodationMXN`, `upsellsSubtotal`, `utvGas`), `defaultTipRate = 0.05`, and the fee rate. Drop `presetTip`/agreed-tip floor.

**`supabase/functions/guest-payment-checkout/index.ts`**
- Server recompute: no mandatory gratuity, no agreed-tip floor. `tip` = guest selection only (percent of base, or custom MXN/USD converted at FX). `chargeable = upsells + gas + tip`; `fee = 5%` of that; `total = chargeable + fee`. Guard `total <= 0` still allowed to proceed only if there is something to charge (upsells/gas); a tip-only-zero booking with upsells still charges the upsells. Stripe line items: replace the "Staff gratuity (5% included)" line with a single "Staff tip" line shown only when tip > 0. Keep `adaptive_pricing: { enabled:false }` and `currency:"mxn"`.

**`src/pages/GuestPayment.tsx`**
- Default state: `tipChoice = "percent"`, `tipPct = 5`.
- Preset buttons `[5,10,15,20]`; clicking the active percent resets to no tip (`tipPct = 0`, choice cleared). `Custom` unchanged (MXN/USD toggle).
- Remove the mandatory-gratuity rows in both the gratuity card and the dark totals card; render a single **Tip** line reflecting the current selection.
- Update helper text: "Calculated on accommodation + experiences (…)."

**`src/pages/concierge/NewBooking.tsx`**
- Remove `gratuityWaived` state, its toggle UI, and `gratuity_waived` from the saved payload. Remove agreed-tip-floor plumbing that fed `guest_tip` as a link floor (keep normal cash-tip / CC-tip recording used for internal accounting as-is).

**`src/pages/concierge/AllBookings.tsx`**
- Remove the "5% Gratuity" pass-through line from the invoice card (line ~793) and CSV export (line ~314). Show the actual tip paid by the guest from the payment data instead.

## Out of scope
- Cash tips left at the house (internal accounting) stay as-is.
- Card processing fee logic stays as-is.

## Verification
- Load a `/pay/:token` link: 5% pre-selected, total includes it.
- Click 5% again → tip drops to 0, total updates.
- Pick 10/15/20 → total updates; Custom USD → converts at FX.
- Stripe checkout stays in MXN; charged total matches the on-page total.
- Concierge form no longer shows the waive-gratuity toggle; saving works.
