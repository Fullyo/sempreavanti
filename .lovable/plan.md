## Goal

The long hero sentence ("Two luxury beachfront villas. Five bedrooms. Fully hosted. Where wellness, dining, adventure, and celebration flow seamlessly.") is hard to read over the busy photo. We'll make the hero stronger and more legible, and relocate the descriptive copy into the section below.

## Hero changes (`src/components/home/HeroSection.tsx`)

- **Replace the long subtitle** with the short, punchy tagline: `More Than a Stay — A Destination`. This becomes a refined, legible line directly under "Sempre Avanti" instead of the dense four-clause sentence.
- **Improve readability / make it stronger:**
  - Deepen the gradient scrim (stronger bottom-weighted darkening) so white text reads cleanly over the bright villa photo.
  - Add a subtle text shadow on the title and tagline.
  - Tighten vertical rhythm so the eyebrow → title → tagline → buttons read as one strong, centered block.
- Keep the existing buttons (Inquire / Explore the Estate) and entrance animations.

Resulting hero stack:
```text
A PRIVATE BEACHFRONT DESTINATION   (eyebrow)
Sempre Avanti                       (title)
More Than a Stay — A Destination    (tagline)
[ Inquire ]   [ Explore the Estate ]
```

## Estate section changes (`src/pages/Index.tsx`)

Since "More Than a Stay — A Destination" moves up to the hero, the section below needs a fresh heading and absorbs the descriptive copy:

- **New section heading** (replacing "More Than a Stay — A Destination"), e.g. `Two Villas. One Seamless Estate.`
- **Lead the body paragraph** with the relocated hero line, woven into the existing copy:
  > Two luxury beachfront villas. Five bedrooms. Fully hosted — where wellness, dining, adventure, and celebration flow seamlessly.
- Refine the second paragraph so it doesn't repeat "two adjacent beachfront villas" twice (current copy duplicates this).
- Keep the stats grid, carousel, and "Explore the Villas" button unchanged.

## Notes

- All copy uses existing semantic tokens and fonts (Cormorant Garamond / Montserrat) — no new colors or design tokens.
- No changes to functionality, routing, or the rest of the page sections.
