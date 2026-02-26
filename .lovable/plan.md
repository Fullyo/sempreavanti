## New Page: Gourmet Dining Menu (`/menu`)

### Overview

A dedicated, beautifully formatted menu page at `/menu` that guests receive as a link to browse and choose their meals. The design prioritizes readability and elegance, matching the site's luxury editorial aesthetic.

### Design Approach

Rather than mimicking the uploaded reference (which uses a traditional printed-menu look with decorative borders), I'll design this as a clean, editorial web-native menu that matches the site's existing brand:

- **Four-column layout on desktop** (Breakfast | Appetizers | Lunch/Dinner | Desserts), collapsing to single-column on mobile
- **Each dish** has its name in serif bold and a one-line description in lighter sans-serif below
- **Category headers** use the bilingual naming from the original (e.g., "Desayuno (Breakfast)")
- **Subtle golden dividers** between categories on mobile
- **Included items** (fruit bowls, juice, coffee) shown as a small italic footnote under Breakfast
- **Pizza Night note** shown as a styled callout card at the bottom
- **No photos** on the menu itself -- the focus is pure typography and readability
- A light `bg-card` background with generous whitespace to feel like an elegant printed menu translated to screen
- A small hero/header area with the page title and a brief intro line

### Content -- Verbatim from User Input

All dish names and descriptions will be taken exactly from the user's provided text. No AI rewording of menu items.

### Technical Plan

**New file: `src/pages/Menu.tsx**`

- Layout with Navbar/Footer
- Small header section (no full hero image -- keeps it clean and menu-focused)
- Four categories rendered in a responsive grid
- Each item: dish name (serif, medium weight) + description (sans, muted, small)
- Breakfast footnotes for included items
- Pizza Night callout card
- Bottom CTA linking to `/chef` for the full chef experience and an inquiry button

**Modified file: `src/App.tsx**`

- Add route: `<Route path="/menu" element={<Menu />} />`

**Modified file: `src/components/layout/Navbar.tsx**`

- Add "Menu" link under the existing "The Estate" dropdown group (alongside Chef)

**Modified file: `src/components/layout/Footer.tsx**`

- Add "Menu" link in the Estate column

**Modified file: `src/pages/Chef.tsx**`

- Add a "View Full Menu" link/button pointing to `/menu` in the menu section, replacing the inline abbreviated menu list (or linking from it)

### Page Structure

```text
┌─────────────────────────────────────┐
│  Navbar                             │
├─────────────────────────────────────┤
│  Header: "Gourmet Dining"          │
│  Subtitle line                      │
├─────────────────────────────────────┤
│  4-col grid (1-col on mobile)       │
│                                     │
│  Desayuno    │ Appetizers │         │
│  (Breakfast) │            │         │
│  ──────────  │ ─────────  │         │
│  Item name   │ Item name  │         │
│  description │ description│         │
│  ...         │ ...        │         │
│              │            │         │
│  Almuerzo/   │ Desserts   │         │
│  Cena        │            │         │
│  ──────────  │ ─────────  │         │
│  Item name   │ Item name  │         │
│  description │ description│         │
│  ...         │ ...        │         │
├─────────────────────────────────────┤
│  Pizza Night callout card           │
├─────────────────────────────────────┤
│  CTA: "Explore the Chef Experience"│
│  + Inquiry button                   │
├─────────────────────────────────────┤
│  Footer                            │
└─────────────────────────────────────┘
```

### Files Changed

1. **New**: `src/pages/Menu.tsx` -- the full menu page
2. **Edit**: `src/App.tsx` -- add `/menu` route
3. **Edit**: `src/components/layout/Navbar.tsx` -- add Menu to The Estate dropdown
4. **Edit**: `src/components/layout/Footer.tsx` -- add Menu link
5. **Edit**: `src/pages/Chef.tsx` -- link to `/menu` from the menu section

&nbsp;

No inquiry button this is information only and you must also hide the page /menu , it will only be shared with staying guests