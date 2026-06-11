# Hero Redesign

A cleaner, more editorial hero that puts the location front and center, fixes the terminology, and tones down the buttons.

## Copy decisions

On terminology: I will avoid "private beachfront" (per brand rules — "private beach" is forbidden). The estate sits in the Sayulita municipality, but the beach itself is Patzcuarito. So the location reads honestly as both:

- **Eyebrow** (small, above title): `RIVIERA NAYARIT · SAYULITA`
- **Title** (unchanged): `Sempre Avanti`
- **Subtitle** (replaces "More Than a Stay — A Destination"): `Secluded beachfront on Patzcuarito Beach`

This keeps it short, readable, names both places, and stays inside the brand language ("secluded beachfront").

## Hero layout (`src/components/home/HeroSection.tsx`)

New vertical stack, centered:

```text
        RIVIERA NAYARIT · SAYULITA        (eyebrow, letter-spaced, smaller)
              Sempre Avanti               (serif title, unchanged)
   Secluded beachfront on Patzcuarito Beach   (serif subtitle, lighter)
        [ Inquire ]   Explore the Estate →   (toned-down buttons)
```

Visual refinements:
- Keep the existing background image and the stronger bottom-weighted gradient scrim and text shadows (good for readability).
- Tighten vertical rhythm so the stack feels balanced.

## Buttons (toned down)

Currently two full pill buttons — one solid accent, one outlined — both heavy.

New treatment:
- **Primary:** `Inquire` — keep one accent pill but smaller (reduced padding, lighter weight), so it reads as a single clear call to action.
- **Secondary:** `Explore the Estate` — convert to a subtle underlined/arrow text link (no border, no fill), so it stops competing with the primary.

This gives a single confident CTA plus a quiet secondary, instead of two competing blocks.

## Scope

- Only `src/components/home/HeroSection.tsx` changes.
- No changes to the Estate section, routing, or other page content.
- Uses existing semantic tokens and fonts (Cormorant Garamond / Montserrat) — no new colors.

If you'd prefer different wording for the subtitle (e.g. drop "Beach", or add "fully hosted"), tell me and I'll adjust before/after building.