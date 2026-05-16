## Concierge Booking Tool — Build Plan

A hidden, password-gated internal operations tool at `/concierge` for the team to log upsell bookings, calculate guest charges and profit splits, and generate guest invoices + owner statements. Backed by Lovable Cloud (Supabase).

### Scope summary

- New route `/concierge` (not linked in nav/footer), session-based password gate using `VITE_CONCIERGE_PASSWORD`
- 2 new Supabase tables: `services` (catalogue) and `bookings` (history), seeded with 57 services
- 5 tabs: New Booking, All Bookings, Price List, Export, Settings
- PDF guest invoice via `@react-pdf/renderer`, HTML print-to-PDF for owner statements
- Static April 2026 historical USD report

### Build sequence (8 steps, matching user's prompts)

**1. Foundation, auth, shell**

- Add env var `VITE_CONCIERGE_PASSWORD` (user will set in Lovable settings — confirm before building)
- Create `services` + `bookings` tables via migration with permissive RLS (`true`)
- Build `/concierge` route, password gate (sessionStorage), header, 5-tab shell
- Add Cormorant Garamond + Jost via Google Fonts; design tokens (cream/gold palette) as Tailwind/CSS vars

**2. Seed catalogue + calc utilities**

- Insert 57 services into `services` table
- Create `src/lib/calculations.ts` with `calcGuestTotal`, `calcProfit`, `calcCost`, `calcTip`, `calcCCFee`, `formatMXN`, `CATEGORY_ORDER`

**3. New Booking tab**

- Guest info + dynamic services table with searchable combobox grouped by category
- Live calculations, tip ($/% toggle), 3% CC fee toggle
- Dark summary panel; save to Supabase; validation + toast

**4. All Bookings tab**

- Read all, group by month, inline edit, delete with confirm
- CSV "Download All", per-month "Owner Statement" trigger, JSON backup + restore
- Historical Reports section with April 2026 button

**5. Settings tab**

- Editable price catalogue grouped by category
- Add/edit/delete services, type dropdown, active toggle, commission preview
- CSV export of price list

**6. Price List + Export tabs**

- Price List: printable internal reference with commission legend and per-category tables
- Export: Copy-to-clipboard (TSV), CSV download, inline HTML preview

**7. Guest invoice PDF**

- Install `@react-pdf/renderer`; register fonts
- Generate cream/gold letter-size PDF, guest-facing only (no costs/profits), instant download

**8. Owner statement + April 2026 historical**

- Owner statement: new tab HTML with summary cards, per-booking tables, 85/15 split, print button, CSV export
- April 2026: static USD page, hardcoded 6 bookings as specified

### Technical notes

- All money formatting uses `formatMXN`; rounding via `Math.round` as specified
- Combobox: use existing `@/components/ui/command` (cmdk) for search
- Date handling: native `<input type="date">` + `date-fns` (already in project)
- PDFs open via Blob URL + `<a download>` for instant save
- Owner statement opens in `window.open()` with self-contained HTML+CSS
- Navbar: add `/concierge` to `forceScrolled` paths so navbar is visible (consistent with utv-contracts pattern) — OR render `/concierge` outside `<Layout>` since the spec defines its own header. **Recommendation: render outside Layout** (matches "before anything else" auth requirement and avoids duplicate headers)
- SEO: `<SEO noindex />` on `/concierge`

### Clarifying questions before I start

1. **Password storage**: The plan stores `VITE_CONCIERGE_PASSWORD` client-side (visible in the JS bundle to anyone who inspects it). This matches your spec but is not secure against a determined visitor. OK to proceed as-is, or do you want server-side auth (Supabase edge function check)? i take your recommendation. I though the ideas was to have a hidden page with a password to enter that page?
2. **Public navbar on** `/concierge`: Should the site's main navbar appear, or only the tool's internal dark header (cleaner, recommended) only available to admins
3. **Build all 8 prompts in one go**, or pause after each for you to test? (One-go is faster; staged is safer.) all in one go

### Out of scope

- No public links added anywhere
- No changes to existing pages or SEO beyond noindex on `/concierge`
- No auto-archive/deletion logic