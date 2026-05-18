## 1. Transport flat-fee profit: $60 → $55 (May 2026)

Apply the new rule (flat $55 USD profit per transport trip, replacing the previous $60) to every transport line in `src/pages/concierge/may2026Historical.ts`.

**Maxim booking — line items affected:**
- Airport SUV (Round Trip): guest paid stays $395, profit $60 → **$55**, cost $335 → **$340**, owner $51 → **$46.75**, LUX $9 → **$8.25**
- Taxi: guest paid stays $290, profit $60 → **$55**, cost $230 → **$235**, owner $51 → **$46.75**, LUX $9 → **$8.25**
- Inline em note text: "1,000 MXN profit per trip ≈ $60" → **"Flat $55 USD profit per trip"**

**Maxim totals recalculated** (−$10 profit total):
- Cost $3,368.51 → **$3,378.51**
- Profit $3,321.81 → **$3,311.81**
- Owner 85% $2,823.54 → **$2,815.04**
- LUX 15% $498.27 → **$496.77**

**Grand summary recalculated** (top cards + bottom grand block):
- Total Profit Pool $4,050.81 → **$4,040.81**
- Owner's Share $3,443.19 → **$3,434.69**
- LUX's Cut $607.62 → **$606.12**
- (Total Billed unchanged at $8,270.32 — guest-paid amounts are not touched)

**FX note rewrite (top of report):** drop the "1,000 MXN ≈ $60" framing and replace with: *"Transport flat fees are recorded at a fixed $55 USD profit per trip regardless of FX. UTV rates vary per booking — we always use the actual amount charged on the Guesty folio."*

No changes to other bookings (Izquierdo, Teresa — no transport lines) and no changes to `calculations.ts` since the `flat` type there is MXN-based for live bookings; the May report is a hardcoded historical snapshot.

---

## 2. AllBookings landing UX — recommendation

**Problem:** landing on `/upsells/bookings` currently shows an empty-feeling list grouped by month with an "all" filter — no immediate signal of what matters now.

**Recommended solution: segmented tabs at the top**

```text
[ Current Month ] [ Upcoming ] [ All Bookings ] [ Archive ]
       ▲ default
```

- **Current Month** (default tab on load): shows only bookings whose check-in OR check-out falls in the current calendar month. Header shows month name + a compact KPI strip (bookings count · total billed · profit pool · owner share · LUX cut) computed live from the filtered set — same visual language as the May 2026 historical report cards, so the page feels alive immediately.
- **Upcoming**: future check-ins (next 60 days), sorted ascending. Useful for prep.
- **All Bookings**: the existing grouped-by-month view (current behavior preserved).
- **Archive**: past months older than current, collapsed by month with click-to-expand.

**Why tabs (not just a default filter):**
- Keeps the existing "all months" view one click away — no functionality lost.
- Each tab has a distinct purpose, so the empty state on Current Month (when there are zero bookings this month) can show a meaningful CTA ("No bookings this month yet — [+ New Booking]") instead of just an empty list.
- KPI strip on Current Month doubles as a quick monthly pulse without opening the full historical report.

**Light alternative if you want less scope:** skip Upcoming/Archive, ship just two tabs — **Current Month** (default) and **All Bookings** — plus the KPI strip on Current Month. This is the smallest change that fixes the "boring landing" feeling.

Tell me which option you want (full 4-tab vs. light 2-tab) and I'll build it together with the $55 transport update.