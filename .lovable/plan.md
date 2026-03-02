

## Revamp /pricing → Experiences Page

### Understanding the "header" issue
The current page has a simple title then you scroll through categories linearly. I believe you mean the category sections aren't scannable at a glance — you can't see what's available without scrolling through everything. I'll add a **sticky category bar** at the top (below the page intro) with anchor links to each section so guests can jump directly to Wellness, Surf, Boats, etc.

### On photos
I agree — **no photos**. This is a reference sheet shared via email. Keeping it text-only makes it load fast, print cleanly, and stay scannable. Photos would add clutter to what should feel like a polished menu/rate card.

### Content structure (from your list)

**Categories with anchor navigation:**
1. **Wellness** — Yoga, Sound Bath, Massage, Personal Training, Pilates
2. **Food & Culinary** — Taco Tour, Cooking Class
3. **Surf** — Sayulita lesson, La Lancha experience
4. **Boats & Fishing** — Private boat, Fishing charter, Spearfishing inshore/deep
5. **Polaris Rentals** — 2/4/6-seater with operating limits
6. **Transportation** — Airport SUV only

All prices in MXN. Each item gets: name, price, duration/capacity, and a short description — matching the content you provided exactly.

### Layout design
- **Intro section**: "Make the Most of Your Stay" heading with your intro copy and the 24-hour notice line
- **Sticky category tabs**: Horizontal scrollable bar that sticks below the navbar, showing all 6 categories as clickable anchors
- **Category sections**: Each with a gold accent divider + category title, then items in a clean list format — item name bold on the left, price on the right, description and details below in muted text. Bullet lists for "Includes" where applicable
- **Footer note**: "All experiences require a minimum of 24 hours' notice. Prices in MXN."

### Route
Keep the route as `/pricing` (no need to change URL since it's shared via email — changing it would break existing links). The page title/heading will say "Experiences" though.

### Technical changes
1. **`src/pages/Pricing.tsx`** — Complete rewrite of content and layout with new data, sticky category nav, anchor scroll behavior
2. **`src/App.tsx`** — No changes needed (route stays `/pricing`)
3. **Navbar** — No changes (this page is shared via email link, not navigated to from the site nav)

