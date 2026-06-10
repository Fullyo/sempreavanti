# Petty Cash Tracker — per guest + monthly pool

Add a "Concierge Petty Cash" box above every reservation. Scott (owner) hands the concierge a cash float for each guest; the box shows that float, what was spent on the guest, and the balance left. Each month also gets a roll-up summary so you can see total cash given vs. total spent vs. what's left in petty cash.

## How it works

For each booking card the box shows three values:

```text
+-----------------------------------------------------------+
| CONCIERGE PETTY CASH — [Guest name]                       |
|   Owner Float In        Spent on Guest        Balance     |
|   $ [____ editable]     $ 1,234.00 (auto)     $ 3,766.00  |
+-----------------------------------------------------------+
```

- **Owner Float In** — editable field. You type how much Scott gave the concierge for that guest (e.g. $5,000). Saved per guest. Starts blank.
- **Spent on Guest** — calculated automatically = our **cost of the upsells** (what the concierge actually paid out of pocket for that guest's services). Not editable.
- **Balance** — Float In − Spent. Green if positive, red if negative.

At the bottom of each month, a **Petty Cash Summary** rolls up all guests:
- Total given by owner · Total spent on guests · Petty cash remaining.

## Where it appears

The box appears everywhere bookings render:
1. **All Bookings view** — above each live (MXN) card and each historical (USD) card, with the monthly summary in each month folder.
2. **May 2026 printable report** — a display version of the box above each of the 6 bookings, plus a month-end petty cash summary block. (Editable in the app; the printable report shows whatever has been saved, with blank float placeholders until amounts are entered.)

## Spent calculation

- **Live (MXN) bookings:** sum of each item's `cost` (the "Our Cost" column already computed), in MXN.
- **Historical (USD) bookings:** `upsellsBilled − upsellsProfit` = our cost, in USD.
- Currency of the box matches the booking (MXN for live, USD for historical) so no FX mixing.

## Technical details

**New table `public.petty_cash`** (stores the editable float per guest, since historical bookings are hardcoded and live bookings are in the DB — both need a stable key):

```sql
create table public.petty_cash (
  booking_ref text primary key,   -- 'live-<id>' or historical string id (e.g. 'hist-may-jackson')
  float_amount numeric not null default 0,
  currency text not null default 'USD',
  notes text,
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.petty_cash to anon, authenticated;
grant all on public.petty_cash to service_role;
alter table public.petty_cash enable row level security;
create policy "Allow all on petty_cash" on public.petty_cash for all using (true) with check (true);
```

(Mirrors the existing open policy on `bookings`; the tool is gated by the concierge password edge function.)

**`src/pages/concierge/AllBookings.tsx`**
- Load all `petty_cash` rows on mount into a `Record<ref, {float, currency}>` map.
- Add a `PettyCashBox` component rendered above each historical and live card. Shows Float In (editable input), Spent (computed), Balance. On blur/change it upserts to `petty_cash` keyed by ref (`live-${b.id}` or `h.id`).
- Compute Spent per booking via a helper: live = sum of `item.cost`; historical = `upsellsBilled − upsellsProfit`.
- Add a **Petty Cash Summary** row at the end of each open month section: totals of float, spent, and balance (kept per currency to avoid FX mixing).

**`src/pages/concierge/may2026Historical.ts`**
- Add a styled petty-cash box above each of the 6 booking sections (Float In shown as blank placeholder line, Spent computed from each booking's cost, Balance line).
- Add a month-end Petty Cash Summary block before the Grand Summary.

**`src/lib/calculations.ts`**
- Add a small `bookingUpsellCost(booking)` helper for the live-cost sum (reused by the box and summary).

## Out of scope
- No FX conversion between MXN and USD in the petty cash totals (each shown in its own currency).
- Float is a single number per guest; no per-deposit ledger of multiple cash drops.