# Guest Meal Planner + Guesty Reservation Sync

Two connected pieces:

1. **Reservation sync** — auto-pull upcoming Guesty reservations so the concierge never re-types guest name and dates (feeds both the meal planner *and* the existing upsell tool).
2. **Meal planner** — a per-guest, no-login link where guests pick meals day-by-day from our menu; concierge and chef can view and edit the same plan.

---

## Part 1 — Guesty reservation sync

### Can we pull reservations, and how fresh?

Yes. We already have Guesty **Open API** credentials (`GUESTY_OPEN_API_CLIENT_ID` / `_SECRET`) stored. The Open API `/v1/reservations` endpoint returns confirmed bookings with guest name, check-in, check-out, and listing. (Our current site integration only uses the Booking Engine API, which cannot do this — so this is a new, separate connection using credentials we already hold.)

**Refresh cadence:** an automatic background sync every **30 minutes** (adjustable), plus a manual **"Refresh now"** button in the concierge tool. So a guest who books today shows up — with their meal sheet and upsell sheet ready — within about half an hour, or instantly if the concierge clicks refresh. We fetch reservations from today forward (e.g. next 180 days).

```text
Guesty Open API  ──(every 30 min / manual)──▶  reservations table
                                                     │
                        ┌────────────────────────────┼────────────────────────────┐
                        ▼                                                           ▼
              Upsell tool (auto-fill guest + dates)              Meal planner sheet (auto-created)
```

### What the concierge experiences

- A new **"Reservations"** area lists upcoming stays pulled from Guesty (guest, dates, nights).
- Each reservation shows two ready-to-copy links: **Meal link** and (future) prefilled upsell.
- Concierge "edits" rather than types: name and dates come from Guesty; concierge only adjusts extras.

### Technical notes

- New `reservations` table keyed by Guesty reservation id (guest name, checkin, checkout, listing id, status, `meal_token`, timestamps). Service-role only; all access via the secured `concierge-db` gateway (same HMAC-token pattern already in use). Anon has no direct access.
- New edge function `guesty-reservations-sync`: OAuth against `open-api.guesty.com`, upsert reservations, mint a `meal_token` (UUID) per new reservation. Token cached like the existing Guesty token.
- Scheduled via `pg_cron` + `pg_net` (30-min interval); manual trigger through `concierge-db`.
- **Build-time verification:** confirm our Open API credentials have the reservations scope before wiring the UI. If the scope is missing, the fix is a Guesty-side scope grant — no code change — and the manual/typed fallback still works meanwhile.

Note: linking upsell bookings to synced reservations is a follow-up; this plan builds the sync + meal planner and leaves an obvious hook for the upsell auto-fill.

---

## Part 2 — Meal planner

### Guest link (no login)

Unique URL per stay, same proven pattern as the pay link: `/meals/:token`. No password — the long random token is the key. Concierge/chef grab links from the Reservations list.

### The guest form

Header explains the house rules (pulled from your message):

- Two on-site chefs; everything made from scratch, planned in advance.
- One main per meal, family-style; chefs do the grocery shopping; food billed at market cost.
- Link to the full menu (`/menu`).
- **Sunday = no service**, clearly marked and non-editable.
- Guest sets **preferred breakfast & lunch times**; **dinner fixed at 5:00 PM** (shown, not editable).

**Day-by-day layout**, generated from check-in → check-out. Each day is a card labeled with the real date and weekday (e.g. "Day 1 — Monday, Sep 22"). Per day:

```text
Day 2 — Tuesday, Sep 23
  Breakfast        [ dropdown ▾ ]
  Lunch appetizer  [ dropdown ▾ ]
  Lunch            [ dropdown ▾ ]
  Dinner appetizer [ dropdown ▾ ]
  Dinner           [ dropdown ▾ ]
  Dessert (optional)[ dropdown ▾ ]
```

- Dropdowns are populated from our existing `/menu` dishes, grouped by course (breakfast dishes for breakfast, appetizers for the two appetizer slots, mains for lunch/dinner, desserts for dessert).
- Every dropdown includes **"No meal this day / skip"** and **"Special request (write below)"**.
- **Sunday cards** show a "No chef service on Sundays" banner instead of dropdowns.
- One **free-text "Special requests / dietary restrictions / allergies"** box for the whole stay (covers off-menu meals and requirements).
- Autosave on change (plus an explicit Save), so guest and staff always see the latest. A subtle "Last updated ..." line.

### Menu source

Menu dishes come from the existing `/menu` list, moved into a small `**menu_dishes**` table (course + name + description) seeded from the current page. This lets the *same data* power both the public menu page and the planner dropdowns, and lets you add a dish later without a developer if desired. If you'd rather not manage a table, we can instead read the menu straight from code — but the table keeps the public page and planner in sync and is low effort. Off-menu/special dishes are handled entirely by the special-requests field, as you noted.

### Concierge/chef editing

Same `/meals/:token` link opens the same editable form (per your choice: guest + concierge/chef all edit the same plan). Additionally, in the concierge tool each reservation has an "Open meal plan" action. Chef gets the link too — one link, always current, editable by all, no logins.

### Data model

- `meal_plans` table: one row per reservation (`meal_token`, reservation ref, guest, checkin, checkout, breakfast_time, lunch_time, special_requests, timestamps).
- `meal_selections`: rows per day/course (date, course, dish id or free-text, `skip`).
- New edge function `meal-plan` (public, token-gated): `get` returns menu + plan + selections for a token; `save` upserts selections and the special-requests/time fields. Token validated as a UUID, same guard as `guest-payment-get`. Service-role writes only; RLS denies anon direct table access.

---

## Technical section (for reference)

- **New tables:** `reservations`, `meal_plans`, `meal_selections`, `menu_dishes` — all service-role only, GRANTs to `service_role` (+ `authenticated` where needed), RLS on, no anon grants. All guest/staff access flows through edge functions.
- **New edge functions:** `guesty-reservations-sync` (Open API OAuth + upsert + token mint, cron + manual), `meal-plan` (public token-gated get/save).
- **Cron:** `pg_cron` + `pg_net`, 30-min sync (configurable), inserted via the data tool (contains project URL + key).
- **Frontend:** new public route `/meals/:token` (`MealPlanner.tsx`); new "Reservations" tab in the concierge tool listing synced stays with copyable meal links; menu page refactored to read `menu_dishes`.
- **Reuses existing patterns:** UUID token links (pay link), HMAC-gated `concierge-db`, Guesty OAuth token caching in `guesty_cache`.
- **Sequencing:** (1) reservations table + sync function + verify Open API scope; (2) menu_dishes table + seed + Reservations tab; (3) meal_plans/selections + `meal-plan` function + `/meals/:token` UI; (4) cron.

---

## Open items to confirm

- **30-minute sync interval** OK, or prefer more/less frequent?
- **Menu in a table** (editable, keeps public page in sync) vs. **read from code** (zero new table) — I recommend the table.
- Any **listing filter**? If Guesty returns more than this property, I'll filter to the Villas Sempre Avanti listing id already used elsewhere. ( as you know it's 3 listings... Luisa & Piertro & Sempre Avanti is whn guests book the two villas. 