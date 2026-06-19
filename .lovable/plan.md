## Goals

Four fixes spanning the service catalog, the concierge booking form, and the guest payment link.

---

### 1. Correct the swapped UTV seater labels

The two UTV rentals have the wrong seat counts. Each model keeps its current price; only the seater suffix changes.

| Current | Corrected |
|---|---|
| Can-Am Maverick 4-seater — $2,500/day | **Can-Am Maverick 6-seater — $2,500/day** |
| Polaris Ranger 6-seater — $2,200/day | **Polaris Ranger 4-seater — $2,200/day** |

This is a data update to the `services` table rows (ids 27 and 28) — names only, prices unchanged.

---

### 2. Rework the gratuity / tip section on the guest payment link

Current behavior: the concierge-agreed card tip pre-fills the "Custom" input as an editable, removable number (the "4800" box in the screenshot), letting the guest opt out. That is wrong.

New behavior on `/pay/:token`:

- **Agreed credit-card tip** (set by concierge, e.g. Julie's 300 USD) is shown as a clear, always-included line: *"Tip agreed with concierge — $X MXN"*. It is the floor; the guest cannot go below it.
- The default tip equals the agreed amount. The custom number box is **hidden by default** and only appears when the guest taps **Custom**.
- When **Custom** is open, the guest can type an extra amount and choose **MXN or USD** (currency toggle); the entered USD converts at the booking FX rate. The custom amount cannot be set below the agreed floor.
- The **10% / 15% / 20%** presets add an optional tip on top of the gratuity base, still respecting the agreed floor.
- **Cash already left** (tip left in cash at the house, in whatever currency) is shown as an **info-only** row — *"Already left in cash — $X"* — and is NOT added to the card charge.
- The dark totals box reflects: experiences, included gratuity (unless waived, see #4), the agreed/selected card tip, card fee, and total due.

This keeps everything the concierge entered at booking time visible on the invoice (line items, fuel, agreed card tip, cash tip).

---

### 3. Show everything entered at booking creation on the invoice

To support #2, the `guest-payment-get` edge function will additionally return the cash tip already recorded (`tip_cash` / its currency) and the agreed card tip, and the `guest-payment-checkout` function will accept a tip currency so a USD custom tip converts correctly server-side (amounts are always recomputed server-side, never trusted from the client).

---

### 4. Concierge toggle to waive the mandatory 5% gratuity

For rare cases where service went badly and we don't want to request the 5%.

- New boolean column `gratuity_waived` on `bookings` (default `false`).
- New toggle in the concierge booking form (`NewBooking.tsx`), in the Tips & Adjustments area: *"Waive mandatory 5% gratuity"*.
- When waived: the concierge totals, the `/pay` page, and `guest-payment-checkout` all skip the 5% gratuity line entirely. The card fee then applies only to upsells + fuel + tip.
- The payment page hides the "5% gratuity included" copy when waived.

---

## Technical notes

- **Data update** (`services` ids 27, 28): names only — done via the data/insert tool, not a schema migration.
- **Schema migration**: add `gratuity_waived boolean not null default false` to `public.bookings`; allow it in `concierge-db` edge function's column allow-list and in `src/integrations/supabase/types.ts` typing path.
- **`src/lib/calculations.ts`**: `computeGuestPayment` gains a `gratuityWaived` flag (gratuity → 0 when true); add optional currency handling for the guest custom tip (or convert in the page before calling).
- **`src/pages/GuestPayment.tsx`**: new tip UI (hidden custom box, MXN/USD toggle, agreed-tip floor, cash-tip info row, waiver-aware copy/totals).
- **`src/pages/concierge/NewBooking.tsx`**: add the waiver toggle; include `gratuity_waived` in the saved payload; recompute totals with it.
- **`supabase/functions/guest-payment-get/index.ts`**: return `tipCash`, `tipCashCurrency`, agreed card tip, and `gratuityWaived`.
- **`supabase/functions/guest-payment-checkout/index.ts`**: honor `gratuity_waived`, accept tip currency, enforce the agreed-tip floor, recompute totals.

No change to how accommodation is handled (still context-only, paid via Guesty, excluded from the card fee).
