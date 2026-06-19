# Zero-Calculation Booking Form

## Goal
The concierge enters raw numbers and never does math. The booking summary shows the **exact** invoice the guest will pay (same numbers as the `/pay` page), every money field accepts MXN or USD, the card fee is applied automatically, and fuel is added automatically for UTV rentals with an editable amount.

## What's wrong today
1. **Card fee is off by default** and hidden behind an Add/Remove button — the concierge has to remember to turn it on.
2. **No fuel** is added in the booking form when a UTV/Polaris is booked. Gas is only auto-added later on the guest `/pay` page, so the concierge's summary understates the total.
3. **The concierge total ≠ the guest total.** The guest page adds a mandatory 5% gratuity (on accommodation + upsells + gas); the booking summary never shows it. So the concierge quotes one number and the guest is charged another.
4. **Service line prices are MXN-only** — no USD entry for items priced/paid in dollars.

## What will change

### 1. Card fee — automatic, still removable
- Defaults to **on** for every booking (new and edit).
- Recalculates live as 5% of the chargeable amount — no manual step needed.
- Keep a small toggle so it can be removed for special cases (per your choice), but it starts applied.

### 2. UTV fuel — auto-added, editable
- When a UTV/Polaris/Can-Am rental line is added, a **Fuel** line is automatically created for each unit, defaulting to **$1,000 MXN per unit**.
- The fuel amount is **editable** (concierge can override the peso value).
- Removing the UTV line removes its auto fuel; manually added fuel is left alone.
- This mirrors the existing `computeUtvGas` rule so the booking and the guest page agree.

### 3. Per-line MXN / USD toggle
- Each service row gets a currency toggle next to its unit price. USD lines convert to MXN at the booking's exchange rate for all totals, cost and profit.
- The exchange-rate field becomes always-relevant (shown whenever any USD value exists: a line, accommodation, or a tip).

### 4. Summary mirrors the guest invoice exactly
Rebuild the Booking Summary so it shows the same line structure and totals as the guest `/pay` page:

```text
Upsells subtotal           (services, converted to MXN)
UTV fuel                   (auto)
Accommodation (context)    (MXN equiv — gratuity base only, not charged)
Included gratuity 5%       (on accommodation + upsells + fuel)
Staff tip — credit card    (optional, part of total)
Card fee 5%                (auto)
─────────────────────────
TOTAL GUEST CHARGE         (identical to /pay)
Staff tip — cash           (reconciliation only, shown separately)
Your total profit
```

The shared calculation helper (`computeGuestPayment` in `src/lib/calculations.ts`) becomes the single source of truth used by both the concierge form and the guest page, so the two can never drift.

## Technical notes
- Add a per-row `currency` (and keep `price` as entered); a row's MXN value = `price * fx` when USD. Update `calcGuestTotal`/`calcCost`/`calcProfit` call sites to use the MXN-normalized price, and persist both the entered value and currency in each saved item.
- Auto-fuel: derive fuel lines from UTV rows in a `useEffect`/memo so they stay in sync; store an editable `fuelPerUnit` (default `UTV_GAS_PER_RENTAL = 1000`). Persist fuel as normal line items so `/pay` doesn't double-add (the existing `computeUtvGas` skips when a gas line is already present).
- Replace the form's ad-hoc `totalGuest = servicesSubtotal + tip + ccFee` with `computeGuestPayment({...})` including mandatory `GUEST_GRATUITY_RATE` (5%) and the card fee, so the concierge total equals the guest total.
- `ccFeeOn` defaults to `true`.
- Save payload stores the final computed `total_guest`, `cc_fee`, gratuity, fuel and per-line currency. A DB migration adds any missing columns (e.g. per-item currency is already in `items` JSON, so likely only a `guest_gratuity`/fuel handling check — confirm during build; no destructive changes).

## Out of scope
- No change to Stripe checkout, the guest `/pay` page layout, pricing markup rules, or the owner statement math (beyond reading the already-correct totals).
