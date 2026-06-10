
# Add three May 2026 bookings

Add the three reservations from the screenshots into the **May 2026** historical records and the printable May report. All check in during May, so all land in the May folder.

## Calculation rules applied (from your answers)
- FX: **16 MXN = 1 USD** for all conversions.
- **Massage:** our cost = **500p per massage**; profit = guest-billed − cost.
- **Tips:** **100% to staff** → pass-through, $0 profit pool (recorded for transparency). *(Will save this as a standing rule in memory.)*
- **Drinks & Alcohol (Abril):** sold **at cost** → $0 profit.
- **Groceries (Abril):** remark shows "12,487 ÷ 16" with no +35% markup → treated **at cost**, $0 profit. (Christopher's shows "+35%" so it keeps the standard markup.)
- **LUX commission:** flat **15% of the shown accommodation fare**; channel fees are NOT deducted and NOT noted.
- **UTV:** owner asset → 100% profit. **Airport transfers:** flat $55/trip profit. **CC fee:** pass-through.

## Booking 1 — Christopher Jackson (GY-gNZkbdwv)
Casa Sempre Avanti (Pietro + Luisa) · May 20–27, 2026 · 7 nights · Invoice #58

| Item | Billed | Cost | Profit |
|---|---|---|---|
| Groceries (1,924usd + 35%) | $2,597.00 | $1,924.00 | $673.00 |
| UTV Rental (both UTVs, 240usd × 3) | $765.00 | $0.00 | $765.00 |
| Airport SUV round trip (6,800p) | $425.00 | $370.00 | $55.00 |
| In-House Massage (6 massages, 8,600p) | $537.50 | $187.50 | $350.00 |
| Tip (10%) — pass-through to staff | $874.00 | $874.00 | $0.00 |

- Accommodation fare **$8,743.00** → LUX 15% $1,311.45 · owner $7,431.55
- Upsells billed **$5,198.50** · Upsell profit pool **$1,843.00**

## Booking 2 — Gustavo Dominguez (HM3KZYP9KW)
Villa Pietro · May 27–Jun 1, 2026 · 5 nights

- Accommodation fare **$1,971.05** → LUX 15% $295.66 · owner $1,675.39
- Only upsell: Tip $197.00 (pass-through to staff, $0 profit). Host channel fee −$305.67 ignored per rule.
- Upsells billed **$197.00** · Upsell profit pool **$0.00**

## Booking 3 — Abril García (HM45CA4DB3)
Villa Luisa · May 28–Jun 1, 2026 · 4 nights · Invoice #60

| Item | Billed | Cost | Profit |
|---|---|---|---|
| In-House Massage (8 massages, 11,800p) | $737.50 | $250.00 | $487.50 |
| Drinks & Alcohol (1,600p) — at cost | $100.00 | $100.00 | $0.00 |
| Groceries (12,487p) — at cost | $780.00 | $780.00 | $0.00 |
| Tip (10%) — pass-through to staff | $143.00 | $143.00 | $0.00 |

- Accommodation fare **$1,426.10** → LUX 15% $213.92 · owner $1,212.19. Host channel fee −$221.05 ignored per rule.
- Upsells billed **$1,760.00** · Upsell profit pool **$487.50**

> Note: For Abril's massage I'm assuming **8 massages** (11,800p ÷ ~1,475p each, one per guest). Tell me if the count differs.

## New May 2026 grand totals (6 bookings)
- Accommodation fare: **$30,857.00**
- Upsells billed: **$15,425.82**
- Upsell profit pool: **$6,371.31**
- Owner's share (upsells 85%): **$5,415.61**
- LUX total cut: **$5,584.25** ($955.70 upsells + $4,628.55 accommodation)

## Files to change
1. **`src/pages/concierge/historicalData.ts`** — add the three bookings to `MAY_2026_BOOKINGS` with `monthKey: "2026-05"`, each with `accommodationFare`, `upsellsBilled`, `upsellsProfit`, and a descriptive `notes` line.
2. **`src/pages/concierge/may2026Historical.ts`** — add three new `booking` sections with full line-item tables (matching the existing styling), and update the top KPI cards + the "Grand Summary" block and "3 bookings" → "6 bookings" labels.
3. **Memory** — save the rule: *Tips are 100% paid to staff → pass-through, excluded from the profit pool.*
