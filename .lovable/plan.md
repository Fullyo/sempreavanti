

## Custom Booking Page — Replace Guesty's Hosted Widget

### The Problem
Right now, "Check Availability" sends guests to Guesty's generic hosted booking page (`casasempreavanti.guestybookings.com`). It's functional but visually disconnected from your brand. Guests leave your beautiful site and land on a plain template.

### The Solution
Build a custom `/book` page directly on your site that uses the Guesty Booking Engine API (which you already have credentials for) to:
1. Show a branded calendar with available/unavailable dates
2. Let guests select dates and group size
3. Display a real-time price quote
4. Redirect to Guesty's checkout for secure payment processing

### Why not handle payment ourselves?
Payment processing through Guesty requires their specific checkout flow to keep reservations properly synced, handle security deposits, cancellation policies, etc. We'll handle the "discovery + pricing" part beautifully on your site and hand off to Guesty only for the final payment step. This gives you 90% of the visual improvement while keeping the booking pipeline reliable.

### What the guest sees (new flow)

```text
[Your Site: /book]                    [Guesty Checkout]
                                      
1. Beautiful calendar               4. Payment form
   (available dates in gold,           (only step off-site)
    blocked dates greyed out)
2. Guest count selector
3. Price breakdown card
   with "Book Now" button
```

### Changes

**1. New edge function: `supabase/functions/guesty-availability/index.ts`**

Fetches calendar data and price quotes from the Booking Engine API:
- `GET /api/listings/{id}/calendar` -- returns available/blocked dates for a given month range
- `POST /api/reservations/quotes` -- returns pricing for selected dates and guest count

Uses the existing `GUESTY_CLIENT_ID` / `GUESTY_CLIENT_SECRET` (Booking Engine scope).

**2. New page: `src/pages/Book.tsx`**

A full-width branded page with:
- Hero section with estate photo and heading
- Interactive two-month calendar showing availability (green/gold = available, grey = blocked)
- Guest count selector (1-14)
- "Get Quote" button that fetches real-time pricing
- Price breakdown card (nightly rate, cleaning fee, total)
- "Book Now" button that redirects to the Guesty checkout URL with pre-filled dates and guest count

The page matches your existing design language: Cormorant Garamond headings, Montserrat body text, golden accents, rounded corners, sand/ocean color palette.

**3. Update all "Check Availability" links**

Replace the external Guesty URL in:
- `src/components/layout/Navbar.tsx` -- desktop and mobile buttons
- `src/pages/Index.tsx` -- CTA section

Change from `<a href={BOOKING_URL}>` to `<Link to="/book">` so guests stay on your site.

**4. Add route in `src/App.tsx`**

Add `/book` route pointing to the new `Book` page.

### Technical Details

**Edge function (`guesty-availability`):**
- Reuses the token caching logic from `guesty-listings` (DB-cached access token with `booking_engine:api` scope)
- Two modes based on a `action` parameter:
  - `action: "calendar"` -- calls `GET /api/listings/{listingId}/calendar?from=YYYY-MM-DD&to=YYYY-MM-DD` and returns an array of dates with availability status
  - `action: "quote"` -- calls `POST /api/reservations/quotes` with check-in, check-out, guests, and listing ID; returns the price breakdown
- Returns clean JSON for the frontend to consume

**Book page components:**
- `AvailabilityCalendar` -- two-month calendar grid using `react-day-picker` (already installed). Blocked dates are disabled/greyed. Available dates are selectable. Selected range highlighted in gold.
- `PriceQuote` -- card that appears after selecting dates, showing nightly rate, number of nights, fees, and total
- "Book Now" constructs the Guesty checkout URL with query params: `?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&minOccupancy=N` and opens it (this is the only moment the guest leaves your site, and it's just the payment form)

**Files created:**
- `supabase/functions/guesty-availability/index.ts`
- `src/pages/Book.tsx`

**Files modified:**
- `src/App.tsx` -- add `/book` route
- `src/components/layout/Navbar.tsx` -- change Check Availability to internal link
- `src/pages/Index.tsx` -- change CTA Check Availability to internal link

