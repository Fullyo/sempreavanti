# Branded PDF Exports — Owner & Guest

Goal: deliver two polished, on-brand PDF exports from the concierge area:

1. **Owner Statement PDF** — per-month financial report (currently only an HTML print page) becomes a true one-click downloadable branded PDF.
2. **Guest Invoice PDF** — already exists for live bookings; keep it guest-facing (only what the guest is charged) and make it consistently available.

Both use `@react-pdf/renderer` (already used by `GuestInvoicePDF.tsx`) so the output is a real downloadable PDF with embedded Cormorant Garamond + Jost fonts and the gold/cream brand palette — no browser "print to PDF" step.

## What gets built

### 1. New file `src/pages/concierge/OwnerStatementPDF.tsx`

A branded owner statement document + `downloadOwnerStatement(...)` helper, mirroring the structure/styling of `GuestInvoicePDF.tsx`:

- Brand header (Villas Sempre Avanti · Riviera Nayarit · Mexico) with "Internal Report · Confidential" tag.
- Title: `{Month} {Year} — Owner Statement`.
- Summary cards: Accommodation fare (Owner 85% / LUX 15%), Upsell revenue, Profit pool (Owner 85% / LUX 15%), Tips to staff (pass-through).
- Per-booking tables: item, guest paid, profit, Owner 85%, LUX 15%, plus tip/CC pass-through rows — same columns as today's HTML statement.
- Grand summary block + footer ("All figures in MXN · Accommodation excluded from profit split · Generated {date}").
- Currency-aware: accepts an `currency: "MXN" | "USD"` flag so historical (USD) months render with `formatUSD` and live months with `formatMXN`.

It will export:

```text
downloadOwnerStatement({ month, year, currency, bookings|histRows, kpis }) -> triggers PDF download
```

### 2. Owner statement coverage for historical months

Today the "Owner Statement" button only shows when `hasLive`. The PDF version will also work for **historical (USD)** and **mixed** months:

- Live-only month → PDF from `group.live` line items (MXN).
- Historical-only month → PDF from `group.hist` aggregate rows (USD): one summary row per guest (accommodation fare, upsells billed, profit, owner/LUX split) since historical entries have no line items.
- Mixed month → two clearly separated currency sections in the same PDF (no FX conversion), matching the existing on-screen "treat each currency block separately" note.

### 3. Wiring in `src/pages/concierge/AllBookings.tsx`

- Replace the current month-header button `⬇ Owner Statement` (which calls `openOwnerStatement`) with `⬇ Owner Statement (PDF)` calling the new `downloadOwnerStatement`.
- Show it whenever the open month has any bookings (`hasLive || hasHist`), not just live.
- Keep the existing CSV download (`downloadOwnerStatementCSV`) available as a secondary "CSV" button for spreadsheet use.
- Keep the full HTML "Open Full May/April 2026 Report" buttons as-is.

### 4. Guest Invoice PDF (`GuestInvoicePDF.tsx`)

- Confirmed guest-facing: shows only services, qty, unit price, amount, optional tip + CC fee, and Total Due — **no cost, profit, or margin**, and **no accommodation line**. This already matches the request ("showing obviously their cost" = what the guest is billed). No structural change needed beyond a label polish ("Concierge Services — Amount Due").
- The per-card "Download Invoice" button stays on each live booking. Historical USD bookings have no line items, so they get the owner statement only (a note will clarify guest invoices require itemized live bookings).

## Out of scope

- No FX conversion between MXN and USD in any combined total.
- No emailing of PDFs (download only).
- No new database changes.

## Technical notes

- Reuse font registration + style patterns from `GuestInvoicePDF.tsx`; factor shared brand constants if convenient.
- `formatUSD` / `formatMXN` / `OWNER_SHARE` / `LUX_SHARE` come from `@/lib/calculations` and `historicalData.ts`.
- All amounts rounded as in existing statement logic.  
  
  
lets stop this action for now, we have to fix calculations.