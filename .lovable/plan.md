

# Consolidate the Website: 11 Pages to 8

## The Problem

Three pages are thin, redundant, and fragment content that belongs together:

- **Transportation** (125 lines): Drive times already on the Location page. UTV info repeated on Villas, homepage Services Grid, and Location.
- **Concierge** (125 lines): Staff bios and "what's included" list. The homepage already covers "Hosted, Not Rented" with the same messaging. The staff ARE the estate.
- **Pricing** (80 lines): A simple reference table that could be a section rather than a destination.

## Proposed Consolidation

### 1. Merge Concierge into Villas

The staff and service philosophy are inseparable from the estate itself. Add a "Your Team" section to the Villas page with the 5 staff bios and the "what's included" checklist. This strengthens the Villas page as the definitive "what you get" page and reinforces the "hosted, not rented" positioning.

### 2. Merge Transportation into Location

Transportation is fundamentally about "where is this and how do I get there." Add an "Getting Here" section to the top of the Location page with airport transfer info, UTV details, and the drive times table. This creates one comprehensive "place and logistics" page.

### 3. Merge Pricing into Contact (Get in Touch)

Guests looking at pricing naturally want to inquire next. Place the pricing reference table above the inquiry form on the Contact page, creating a natural flow: see prices, then ask questions. The disclaimer "all pricing upon inquiry" already lives on the Contact page.

## Resulting Site Structure (8 pages)

```text
Home
Villas ........... (+ staff bios, what's included)
Chef
Wellness
Experiences
Weddings & Events
Location ......... (+ airport transfers, UTVs, drive times)
Get in Touch ..... (+ pricing reference table)
```

## Updated Navigation

```text
The Estate (dropdown)     Experiences     Weddings & Events     Location     Get in Touch     [Check Availability]
  - The Villas
  - Private Chef
  - Wellness
```

- "Plan Your Stay" dropdown is eliminated -- its children are absorbed into other pages
- 4 top-level items + 1 dropdown + CTA button
- Cleaner, faster for guests to scan

## What Changes

### Files to modify:
- **`src/pages/Villas.tsx`** -- Add "Your Team" section (staff bios from Concierge) and "Always Included" checklist before the sleeping config CTA
- **`src/pages/Location.tsx`** -- Add "Getting Here" section at the top with airport transfer and UTV rental cards, plus the drive times table (from Transportation)
- **`src/pages/Contact.tsx`** -- Add pricing reference table above the inquiry form
- **`src/components/layout/Navbar.tsx`** -- Remove "Plan Your Stay" dropdown; update nav to 4 direct links + 1 dropdown
- **`src/App.tsx`** -- Remove routes for `/concierge`, `/transportation`, `/pricing`; add redirects to their new homes
- **`src/components/home/ServicesGrid.tsx`** -- Update links that pointed to `/concierge` or `/transportation` to point to `/villas` and `/location`
- **`src/pages/Index.tsx`** -- Update any CTA links referencing removed pages

### Files to delete:
- `src/pages/Concierge.tsx`
- `src/pages/Transportation.tsx`
- `src/pages/Pricing.tsx`

### Content preserved (nothing is lost):
- All 5 staff bios move to Villas
- All transportation details move to Location
- Full pricing table moves to Contact
- Links throughout the site updated to point to new locations

