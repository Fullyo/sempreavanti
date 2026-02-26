## Create Landscape Screenshot Menu Page at `/menu2`

### Approach

Create a standalone page (no Layout/Navbar wrapper) with a fixed landscape aspect ratio (roughly 16:9), designed as a single self-contained image-like card. The page will use a 4-column grid (Breakfast | Appetizers | Lunch & Dinner | Desserts) similar to the WhatsApp screenshot reference, with a branded header and Pizza Night footer. No scrolling -- everything fits in one viewport-sized landscape frame.

### Design Decisions

- **No Layout wrapper** -- this is a screenshot tool, not a browsable page
- **Fixed dimensions** -- use a container with `width: 1400px; aspect-ratio: 16/10` so the screenshot is always landscape regardless of browser window
- **4-column grid** -- each menu category in its own column, item names bold with descriptions in smaller text below
- **Dark navy/teal background with gold accents** -- inspired by the WhatsApp screenshot aesthetic, high contrast for readability at small sizes in a Google Form
- **Compact typography** -- items need to be readable when the image is scaled down to ~50% of screen width on mobile

### Route

- Add `/menu2` route in `App.tsx` -- no nav link needed (hidden)

### Files

1. `**src/pages/MenuScreenshot.tsx**` -- New standalone page component
2. `**src/App.tsx**` -- Add route for `/menu2`  
  
`no need for header and footer. all i want is a menu to take a screenshot of`
  &nbsp;