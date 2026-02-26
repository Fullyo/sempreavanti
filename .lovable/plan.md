

## Redesign: Style the Menu Page with Mexican Character

### The Problem
The current `/menu` page is functional but visually flat -- plain white background, no decorative elements, no sense of place. It reads like a spreadsheet, not a gourmet dining menu at a luxury Mexican villa.

### Design Direction
Inspired by the uploaded reference (golden borders, agave plant illustrations, warm tones) but adapted to the site's web-native editorial brand. Not a literal copy of the printed menu, but bringing in that Mexican warmth and character.

### Visual Enhancements

**1. Hero Header -- Food photography backdrop**
- Use the existing `chef-hero.jpeg` as a background image with a dark overlay
- "Sempre Avanti Kitchen" eyebrow + "Gourmet Dining" title in white over the image
- Subtitle about Ricardo & Crethell
- Similar hero treatment to other pages on the site (Chef, Experiences, etc.)

**2. Menu container -- Warm parchment-style card**
- The entire menu grid sits inside a warm cream/sand-toned card with a subtle border in the golden accent color
- Rounded corners matching the site's organic aesthetic
- Generous padding to feel like a real menu

**3. Decorative SVG agave accents**
- Small inline SVG agave/leaf motifs used as decorative elements at the top of the menu card and between sections
- Golden accent color (`hsl(42 85% 55%)`) for the decorative elements
- Placed at corners and as dividers -- subtle, not overwhelming
- These are simple geometric SVG shapes, no external images needed

**4. Category headers with decorative lines**
- Each category title gets horizontal ornamental lines on either side (like the reference: `── Desayuno ──`)
- Bilingual headers remain (Spanish title, English subtitle)

**5. Golden accent divider dots**
- Small golden diamond or dot separators between menu items instead of just whitespace
- Adds visual rhythm without clutter

**6. Pizza Night callout**
- Keep the current styled card but add a small pizza/flame icon or agave ornament
- Warm background stays

**7. Bottom CTA**
- Use a food photography background with dark gradient overlay (matching site pattern for bottom CTAs per the style memory)
- "Meet the team behind every meal" with link to /chef

### What Changes

**File: `src/pages/Menu.tsx`** -- Full restyle:
- Add hero section with `chef-hero.jpeg` background (already imported in Chef.tsx, pattern is established)
- Wrap menu grid in a decorative card container with golden border
- Add inline SVG agave decorations (4-5 simple leaf/plant shapes)
- Style category headers with ornamental side lines
- Add subtle golden dot dividers between items
- Restyle the bottom CTA with a photo background + gradient overlay
- Add a small decorative golden line/ornament at the top of the menu card

### Technical Details

- All decorative elements are inline SVGs or CSS -- no new image files needed
- The agave SVGs are simple 3-4 path shapes rendered in the golden accent color
- Hero uses the same pattern as Chef page: `relative h-[60dvh]` with image + overlay
- Menu card uses `bg-[hsl(40,50%,96%)]` (cream) with `border border-accent/30` for the golden frame effect
- Responsive: on mobile the decorative corner elements hide, the card padding reduces, and columns stack naturally
- All menu content (dish names, descriptions) remains exactly as-is -- verbatim from user input

