# Fix booking month placement

## Root cause

Historical bookings are bucketed into month folders using their **check-in date** (`historicalMonthKey` in `src/pages/concierge/historicalData.ts`). Jose Izquierdo checks in 2026-04-29, so he falls into the **April** folder even though his stay (checkout May 4) is a May booking. This is why the month "keeps coming out wrong" — any stay that starts at the end of a month gets misfiled.

## The fix: explicit month override

Stop guessing the month from the check-in date. Add an optional explicit month field to each historical booking and group on that, falling back to the check-in date only when no override is given.

### 1. `src/pages/concierge/historicalData.ts`

- Add an optional field to the `HistoricalBooking` type:
  ```ts
  monthKey?: string; // "YYYY-MM" — forces the folder this booking appears in
  ```
- Update `historicalMonthKey()` to prefer it:
  ```ts
  export function historicalMonthKey(b: HistoricalBooking): string {
    if (b.monthKey) return b.monthKey;
    const [y, m] = b.checkin.split("-");
    return `${y}-${m}`;
  }
  ```
- On the three May records in `MAY_2026_BOOKINGS` (Maxim, Jose Izquierdo, Teresa), add `monthKey: "2026-05"`. This guarantees all three sit in the **May 2026** folder regardless of check-in day — Jose included.

### 2. Verify

- Confirm the May 2026 folder now lists Maxim, Jose, and Teresa, and that April no longer shows Jose.
- Confirm month KPI totals for May add up (accommodation fare + upsells across all three).
- The full May report (`may2026Historical.ts`) already includes all three, so no change needed there.

## Out of scope

No changes to live (MXN) booking grouping, the report layouts, or any other page. Only the historical bucketing key and the three May records are touched.  
  
there are two rules, you can first look at the dates but also if i tell you this goes in may .. it must go in may or the appropriate month

&nbsp;