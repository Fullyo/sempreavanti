# Month-Based Reservations

## Goal

Right now the Reservations tab is one long flat list of every synced Guesty stay. Instead, the concierge should land on the **current month** by default, see only that month's stays, and be able to step forward/back to any other month (e.g. to do meal prep with a guest arriving next month). No separate "all reservations" page. The **Refresh from Guesty** button stays.

## How it works for the concierge

- Opening the **Reservations** tab shows **this month's** stays only (grouped by check-in month).
- A month switcher at the top lets her move to any other month:
  - `‹ Prev` and `Next ›` arrows, with the month name (e.g. "July 2026") in the middle.
  - A "This month" shortcut to jump back to the current month.
- Each month shows a count (e.g. "5 stays") and only shows months that have reservations when stepping through — empty months display a gentle "No stays this month" message rather than being hidden, so navigation stays predictable.
- Every stay card keeps its **Copy meal link** / **Open meal plan** buttons exactly as today.
- **Refresh from Guesty** stays in the top-right and re-pulls all upcoming stays.

## Which month a stay belongs to

A reservation is grouped by its **check-in date's month**. A stay that spans a month boundary (checks in end of July, out in August) shows under its check-in month, which matches how the concierge thinks about arrivals.

## Layout

```text
Reservations                         [ Refresh from Guesty ]
Upcoming stays pulled from Guesty…

        ‹ Prev      July 2026  · 5 stays      Next ›     [This month]

┌───────────────────────────────────────────────────────────┐
│ Philip Lamb                        [Copy meal link][Open]  │
│ Villa Pietro · Jul 11 → Jul 20 · 9 nights                  │
└───────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────────────────────┐
│ Marc Duda …                                                │
└───────────────────────────────────────────────────────────┘
```

## Technical details

- Only `src/pages/concierge/Reservations.tsx` changes. No backend, edge function, or schema changes — the data already syncs into the `reservations` table.
- Add a `selectedMonth` state initialized to the current month key (`YYYY-MM`, local time, matching `getCurrentMonthKey` used in All Bookings).
- Group `rows` into a `Map<monthKey, Reservation[]>` keyed off `checkin` (fallback to `checkout` if `checkin` is missing), sorted by check-in date within each month.
- Build a sorted list of all month keys that have stays; the Prev/Next arrows walk the calendar month-by-month. Disable Prev/Next at the edges of the available range so she can't wander into empty years.
- Keep the existing loading / error / sync-note UI, the `CopyLink` component, and the `fmtDate` helper unchanged.
- Reuse existing styles from `./styles` (`card`, `btnGhost`, `btnPrimary`, `sectionTitle`, `COLORS`).