## Add 15% management commission on accommodation fare — May 2026 report

New revenue stream for LUX: 15% of each booking's accommodation fare. Owner keeps the other 85% (their net payout). This is **separate** from the upsell profit pool — accommodation commission is 100% LUX (no owner split inside this report, since the 85% already goes to the owner as their payout).

### Inputs (confirmed)

| Booking | Accommodation Fare | LUX 15% Commission |
|---|---|---|
| Maxim (3,750 + 3,800 + 4,943) | $12,493.00 | **$1,873.95** |
| Jose Izquierdo | $4,623.85 | **$693.58** |
| Teresa | $2,223.00 | **$333.45** |
| **Totals** | **$19,339.85** | **$2,900.98** |

### Edits to `src/pages/concierge/may2026Historical.ts`

**1. Meta line (top):** change "Accommodation fare excluded" → "Includes 15% management commission on accommodation fare".

**2. Top summary cards** — restructure from 5 to 6 cards (one row, slightly tighter):
- Total Billed to Guest: $8,270.32 (unchanged)
- Accommodation Fare: **$19,339.85** (new)
- Upsell Profit Pool: $4,040.81 (rename "Total Profit Pool")
- Owner's Share 85% (upsells): $3,434.69 (unchanged)
- LUX Total Cut: **$3,507.10** (new — was $606.12; now $606.12 upsells + $2,900.98 accommodation)
- Cash Collected On Site: $1,300.00 (unchanged)

**3. Per-booking — add one row beneath each table's tfoot** (before the existing notes), styled in the gold accommodation-commission language:

```
Accommodation fare: $X · LUX 15% commission: $Y · Owner retains 85%: $Z
```

- Maxim: $12,493 · LUX $1,873.95 · Owner $10,619.05
- Izquierdo: $4,623.85 · LUX $693.58 · Owner $3,930.27
- Teresa: $2,223 · LUX $333.45 · Owner $1,889.55

**4. Grand summary (bottom black block)** — expand grid to 6 cells:
- Bookings: 3
- Guest Billed (upsells): $8,270.32
- Accommodation Fare: **$19,339.85** (new)
- Upsell Profit Pool: $4,040.81
- Owner's Share (upsells 85%): $3,434.69
- **LUX Total Cut: $3,507.10** (combined upsell 15% + accommodation 15%)

Add a sub-line under the grid breaking down LUX's total:
> *LUX cut breakdown: $606.12 from upsells (15% of profit pool) + $2,900.98 from accommodation (15% of fare) = $3,507.10*

**5. FX note (top)** — append: "Accommodation commission is calculated on the room fare only (cleaning fees, taxes, and other Guesty-side line items are excluded from the 15% basis)."

No changes to `calculations.ts` or to the live `bookings` table — the May report is a hardcoded historical snapshot. The live booking flow already handles upsells correctly; accommodation commission is a separate report-level overlay that doesn't belong inside the per-line `items` array.

### Optional follow-up (not in this plan, flag only)

If you want accommodation commission to be tracked **per booking going forward** in the live tool (not just the May historical), I'd add an `accommodation_fare` numeric column to the `bookings` table and surface a single input field in NewBooking + AllBookings edit panel. Say the word and I'll plan that separately.