## Fix the "All Bookings" page so Current Month is actually useful

Two real problems to fix, plus one clarification.

### Problem 1 — The Current Month tab shows the wrong month and no data

**Why it shows "April 2026":** the tab label is computed from your browser's date when the page loads. The screenshot you sent was likely captured from the published (older) version of the site, or before the May report work was deployed. The code already reads "the real current month" — but to remove all ambiguity I'll switch from `getUTCMonth()` to local-time `getMonth()` (UTC can drift a day in some timezones) and add a small line under the tab label confirming today's date.

**Why it shows `$0 MXN` and "No bookings yet":** the May figures (Maxim, Izquierdo, Teresa) exist **only inside the hardcoded HTML report** (`may2026Historical.ts`) — they were never written into the `bookings` table. So the Current Month tab has nothing to aggregate.

**Fix:** extract the May 2026 booking data out of the HTML file into a structured constant (`may2026Bookings.ts`) and merge it into the Current Month view *as read-only rows* — clearly tagged "Historical · USD" so they're visually distinct from live MXN bookings going forward. The "View May 2026 Report" button still opens the rich printable PDF view. Same approach will work for any future month that has pre-tool historical data.

### Problem 2 — KPI cards lump accommodation and upsells together

Rebuild the top KPI strip so accommodation and upsells are **never mixed**. New layout (two grouped blocks side by side, each with its own sub-cards):

```
┌─────────────────────────── ACCOMMODATION FARE ──────────────────────────┐
│  Total Fare      $19,339.85  │  Owner 85%  $16,438.87  │  LUX 15%  $2,900.98 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────── UPSELLS ─────────────────────────────────┐
│  Guest Billed  $8,270  │  Profit Pool  $4,041  │  Owner 85%  $3,435  │  LUX 15%  $606 │
└─────────────────────────────────────────────────────────────────────────┘

┌────────────────────────── COMBINED TOTALS ──────────────────────────────┐
│  Owner Total Earnings  $19,873.56  │  LUX Total Cut  $3,507.10  │  Bookings  3 │
└─────────────────────────────────────────────────────────────────────────┘
```

- Each accommodation/upsell value gets its own card so nothing is "lumped".
- Owner total = Owner accommodation (85% of fare) + Owner upsells share.
- LUX total = LUX accommodation (15% of fare) + LUX upsells share.
- The same structure renders on the **Upcoming (60 days)** and **All Bookings** tabs (with values aggregated over the selected scope) — currently those tabs have no KPI strip at all, which is also why the page felt empty.

**Currency note:** historical May figures are USD; live bookings going forward are MXN. The cards will show the dominant currency for the selected scope and a small note `"Historical USD figures shown in USD — live bookings recorded in MXN"` when both are present. (Long-term we should add an `accommodation_fare` numeric column + a `currency` column to the `bookings` table so this is unified — flagged as follow-up, not in this plan.)

### Problem 3 — Quick clarification

The Current Month tab is meant to give you an **at-a-glance financial snapshot of the month in progress** (bookings checking in or out this month, plus their accommodation + upsell breakdown). It's not a duplicate of the printable historical report — that one stays available via the "View May 2026 Report" button for owner-facing PDFs. Confirm this matches your intent before I build it.

### Files I will touch

- **New:** `src/pages/concierge/historicalData.ts` — exports `MAY_2026_BOOKINGS` (structured rows with accommodation fare per booking) and `APRIL_2026_BOOKINGS` if you want it too.
- `src/pages/concierge/may2026Historical.ts` — read from the new constant instead of duplicating numbers in the HTML string. Output unchanged.
- `src/pages/concierge/AllBookings.tsx` — merge historical rows into Current Month view, rebuild KPI strip with accommodation/upsells split, add the KPI strip to Upcoming and All Bookings tabs too, switch month detection to local time, mark historical rows read-only with a "Historical · USD" badge.

No backend/schema changes, no edits to `calculations.ts`. Live booking flow untouched.

### Open questions before I build

1. For the Current Month tab, do you want the May historical rows to appear **inside the bookings list** (with a "Historical · USD" badge, read-only), or only contribute to the KPI cards at the top with a link to the full report? your recommendation
2. Going forward (June onward), do you want me to add an `accommodation_fare` field to the New Booking form so live bookings carry the same 15%-commission breakdown automatically? If yes I'll plan it separately. yes