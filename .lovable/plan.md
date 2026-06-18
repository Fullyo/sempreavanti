## Guest Upsell Payment System

After the concierge saves a booking, they get a shareable **payment link** (`/pay/<token>`). The guest opens it, sees their stay summary, the included gratuity, optional extra tip choices, and pays by card via Stripe.

### What the guest is charged (all in MXN)

The accommodation fare is **not** charged here (already paid via Guesty) — it is shown for transparency and as part of the gratuity base. USD accommodation fares are converted to pesos at a fixed **16** rate.

```text
Upsells subtotal              (sum of all upsell guest totals, MXN)
Accommodation fare            (shown for context, USD→MXN @16)
─────────────────────────────
Included gratuity (5%)        = 5% × (accommodation + upsells)   ← mandatory
Additional tip (optional)     = guest picks 10% / 15% / 20% / custom × (accommodation + upsells)
─────────────────────────────
Card processing fee (5%)      = 5% × (upsells + gratuity + tip)   ← guest pays
═════════════════════════════
TOTAL CHARGED (MXN)           = upsells + gratuity + tip + 5% fee
```

The guest only ever sees totals — never our cost or profit figures.

### Guest payment page

A new public, editorial-styled page (Cormorant Garamond / Montserrat, ocean-jungle palette) at `/pay/:token`:

- Header with villa name and the guest's name + dates.
- Itemized upsells (name, qty, line total) and accommodation fare line.
- A gratuity note in the house's warm voice, e.g.:
  > "As part of a fully serviced villa, a base 5% gratuity is included. Our staff appreciates it deeply — it makes a real difference for the team caring for you."
- An invitation to add more, with **10% / 15% / 20% / Custom** buttons:
  > "If our concierge, chefs, housekeeping, property team, and valet made your stay special, you're welcome to add to their gratuity."
- A live-updating total and a **Pay by card** button that opens Stripe Checkout.
- A clear confirmation state once paid.

### Concierge side

- In **New Booking**, after saving, show the generated payment link with a **Copy link** button.
- In **All Bookings**, each live booking gets a **Copy payment link** action and a payment-status badge (Unpaid / Paid, with amount + date once paid).

### Stripe (your own keys — BYOK)

- You'll provide your **Stripe secret key** and a **webhook signing secret**, stored securely as backend secrets.
- Checkout runs in MXN. On successful payment, a webhook marks the booking paid and records the amount, gratuity, and tip the guest chose.

---

### Technical section

**Database (migration on `bookings`)**

- `pay_token uuid unique default gen_random_uuid()` — link identifier (backfilled for existing rows).
- `payment_status text default 'unpaid'` — `unpaid` | `paid`.
- `exchange_rate numeric default 16`.
- `guest_gratuity numeric`, `guest_tip numeric`, `amount_paid numeric`, `paid_at timestamptz`, `stripe_session_id text`.
- These are stored separately from the existing concierge `tip`/`cc_fee` fields, so internal owner-statement and profit math is untouched.

**Edge functions** (all `verify_jwt = false`, CORS enabled):

1. `guest-payment-get` — input `{ token }`; uses service role to load the booking and returns a **sanitized** payload (guest, dates, accommodation fare in MXN, upsell line items with names/qty/guest_total only, rate, computed gratuity, payment_status). Strips all `cost`/`profit`/`unit_cost`.
2. `guest-payment-checkout` — input `{ token, tipMode, tipValue }`; recomputes gratuity, tip, and 5% fee server-side (never trusts client amounts), creates a Stripe Checkout Session (mode `payment`, currency `mxn`, line items for upsells, gratuity, tip, fee), stores `stripe_session_id`, returns the Checkout URL.
3. `stripe-webhook` — verifies signature, on `checkout.session.completed` sets `payment_status='paid'`, `amount_paid`, `guest_gratuity`, `guest_tip`, `paid_at`.

**Secrets to add:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (requested via secure form before wiring checkout).

**Frontend**

- New route `/pay/:token` → `GuestPayment.tsx` (public, not behind concierge gate, `noindex`).
- Shared MXN calc helpers (gratuity 5%, fee 5%) added to `src/lib/calculations.ts` so the page and the edge function agree.
- New booking + All Bookings get link-copy buttons and status badges.

**Notes / assumptions**

- Mandatory gratuity and optional tip are both computed on the combined (accommodation + upsells) base — adjustable if you'd rather base the extra tip on upsells only.
- Card fee is 5% (replaces the old 3% reference for this guest flow).
- Currency is always MXN; the only conversion is USD accommodation → MXN at 16.  
  
alwasy include 1000 pesos if guests are renting the UTVs.  if two rentals, 2000 pesos for gas and consider any rules i may have forgotten
- send me also the safe box in the chat for me to insert the api key for stripe
- &nbsp;