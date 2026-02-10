

# Site Restructure: Navigation, Experience Pages, and Venue Pages

## Overview

This is a significant restructuring that involves:
- Reorganizing the navigation menu into 3 dropdown groups + 2 direct links
- Moving Wellness under The Estate and creating 6 new dedicated experience pages
- Splitting the current Events page into separate Weddings and Events pages under a new "Celebrations" menu
- The current monolithic Experiences page becomes a hub linking to 6 individual pages

---

## New Navigation Structure

```text
The Estate (dropdown)          Experiences (dropdown)         Celebrations (dropdown)      Location    Get in Touch
  - The Villas                   - Surfing                      - Weddings
  - Private Chef                 - Boat Tours & Sailing         - Private Events
  - Wellness                     - Tee Off
  - Your Team                    - Dive In
                                 - Land & Adventure
                                 - Cultural & Local
```

---

## New Pages to Create (8 total)

### Experience Pages (6 new pages)
Each page follows the same editorial template: Hero (placeholder photo) -> Intro -> Activity listings with details -> CTA. All content is pulled from the existing Experiences.tsx data, expanded with factual local knowledge.

1. **Surfing** (`/experiences/surfing`) -- Chillo spotlight, all surf breaks (La Lancha, Captain Pablo's, Don Pedro's, Burros, Punta Mita), lesson details
2. **Boat Tours & Sailing** (`/experiences/boats`) -- Private boat tours, fishing charters, spearfishing, catch-and-cook, plus the full Ally Cat / Fat Cat sailing fleet
3. **Tee Off** (`/experiences/golf`) -- Litibu, Four Seasons Pacifico & Bahia, El Flamingo, El Tigre with course details
4. **Dive In** (`/experiences/ocean`) -- Snorkeling, Marietas Islands, scuba, kite surfing, paddleboard, whale watching
5. **Land & Adventure** (`/experiences/land`) -- Zipline, ATV/RZR, horseback riding, jungle hikes, UTV rentals, bird watching
6. **Cultural & Local** (`/experiences/cultural`) -- Markets (La Cruz, Sayulita), Malecon, tequila tastings, San Pancho Cultural Center, Huichol art

### Venue Pages (2 new pages)
Split from the current combined Events page:

7. **Weddings** (`/weddings`) -- Beach ceremonies, long-table dinners, bartender services, coordination details, accommodation for wedding parties
8. **Private Events** (`/events`) -- Retreats, corporate offsites, bachelorette/birthday, family gatherings, fire pit evenings

---

## File Changes

### Modified Files

| File | Change |
|------|--------|
| `src/components/layout/Navbar.tsx` | Update `navItems` array: The Estate adds Wellness, Experiences gets 6 sub-links, new "Celebrations" dropdown with Weddings + Events |
| `src/App.tsx` | Add 8 new routes, keep `/experiences` as redirect or hub |
| `src/pages/Experiences.tsx` | Convert to a hub/overview page linking to 6 sub-pages, or redirect to first experience |

### New Files (8 pages)

| File | Content Source |
|------|---------------|
| `src/pages/experiences/Surfing.tsx` | Surfing category from Experiences.tsx + expanded Chillo section |
| `src/pages/experiences/Boats.tsx` | Boats & Fishing + Sailing categories merged |
| `src/pages/experiences/Golf.tsx` | Golf category with course details |
| `src/pages/experiences/Ocean.tsx` | Ocean & Water category |
| `src/pages/experiences/Land.tsx` | Land & Adventure category |
| `src/pages/experiences/Cultural.tsx` | Cultural & Local category |
| `src/pages/Weddings.tsx` | Wedding-specific content from Events.tsx expanded |
| `src/pages/PrivateEvents.tsx` | Events/retreats content from Events.tsx expanded |

---

## Page Template (each experience page)

Each of the 6 experience pages follows this structure:
1. **Hero** -- Full-width placeholder photo with title overlay
2. **Intro** -- Eyebrow + headline + 1-2 paragraph description
3. **Featured highlight** (where applicable, e.g., Chillo for surfing, Marietas for ocean)
4. **Activity listings** -- Two-column grid with name + description for each activity
5. **Photo gallery placeholder** -- Grid of PhotoPlaceholder components for future photos
6. **CTA** -- "Your concierge arranges everything" + link to /contact

## Weddings Page Structure
1. Hero with placeholder
2. "Your Private Beachfront Venue" intro
3. Ceremony options (beach ceremony, sunset backdrop, capacity)
4. Reception & dining (long-table beachfront dinners, private chef menus)
5. Bar & cocktails (dedicated bartender, sunset margarita ritual)
6. Accommodation (5 bedrooms, flexible configs for wedding party)
7. Coordination (concierge handles vendors, music, decor)
8. Photo gallery placeholders
9. CTA to inquire

## Private Events Page Structure
1. Hero with placeholder
2. "Every Gathering, Elevated" intro
3. Event types grid (retreats, corporate, bachelorette, birthday, family)
4. Venue spaces (beach, fire pit, pool terrace, dining areas)
5. Services (chef, bartender, concierge coordination)
6. CTA to inquire

---

## Technical Details

- All new pages use `Layout`, `SectionHeading`, `PhotoPlaceholder`, and `motion` from framer-motion -- matching existing patterns exactly
- Placeholder images use the `PhotoPlaceholder` component; existing assets (atv.jpeg, fishing.jpg, etc.) are reused where they match the page topic
- The navbar `navItems` array changes from 5 items to 5 items but with different groupings:
  - "The Estate" dropdown: 4 children (Villas, Private Chef, Wellness, Your Team)
  - "Experiences" dropdown: 6 children (the new sub-pages)
  - "Celebrations" dropdown: 2 children (Weddings, Private Events)
  - "Location" direct link
  - "Get in Touch" direct link
- All routes use React Router; nested experience routes use `/experiences/surfing`, `/experiences/boats`, etc.
- The existing `/experiences` route will remain as a redirect to `/experiences/surfing` or an overview hub page
- Content is 100% factual, sourced from the existing Experiences.tsx data and memory context (Michula Tours partnership, location details, staff info, pricing conventions)

