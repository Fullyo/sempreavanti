# Vendor Commissions Owed — Plan

## Goal
When a guest pays a provider directly (e.g. the surf instructor), the concierge needs to record that the vendor owes us back a commission. Each booking gets a small repeatable section where the concierge enters **who owes us** and **how much**, with the ability to add more lines. Those amounts are then tallied automatically into the monthly summary.

## What the concierge sees
On the booking edit sheet (New Booking / edit an existing booking), a new section titled **"Commissions Owed to Us"** below the Internal Billing Notes area:

- Each line has two fields on one row:
  - **Vendor / who owes us** — free text (e.g. "Surf with Victor")
  - **Commission owed** — a number, with a small MXN/USD toggle (defaults to MXN)
- An **"+ Add commission"** button to add another line.
- A small **remove (×)** on each line.
- A running subtotal for that booking shown at the bottom of the section.

Nothing here ever appears on the guest payment page or invoice — it is internal only, like the billing notes.

## Monthly tally
In **All Bookings → month view**, add a **"Commissions Owed"** figure to that month's summary. It sums every commission line across all bookings checking in that month, shown in MXN with a USD sub-line at the standard rate (matching how upsells are displayed). USD-entered commissions are converted at the booking's exchange rate so the total is consistent.

This is tracked as its own number (money owed *to* us, not yet collected) and is not mixed into upsell profit or the owner/LUX split — it's a separate "receivables" line so you can see at a glance what vendors still owe.

## Technical details
- **Database:** add a `commissions_owed` JSONB column to the `bookings` table (default empty array). Each entry: `{ vendor: string, amount: number, currency: "MXN" | "USD" }`.
- **Edge function:** add `commissions_owed` to the `BOOKING_COLS` allow-list in `supabase/functions/concierge-db/index.ts` so it can be saved and read.
- **NewBooking.tsx:** add `commissions` state (array), the repeatable UI section, include it in `buildPayload()`, and reset it in `clearAll()`.
- **AllBookings.tsx:** extend `computeMonthKpis` to sum commission lines (converting USD at each booking's FX rate) and render a new "Commissions Owed" row in the month summary card.
- Historical bookings (data files) simply have no commissions, so they contribute zero.

## Out of scope (kept simple, per your note)
- No "mark as paid / collected" workflow, no per-vendor rollups across months. Just capture + monthly tally. Easy to extend later if you want a receivables ledger.
