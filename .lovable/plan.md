

# Complete Visual Redesign: Vibrant Ocean & Jungle Aesthetic

## The Problem

The current design is flat, lifeless, and generic. It uses:
- A muted grey-beige palette that feels corporate, not tropical
- All rectangular photo frames with no visual interest
- Monotone sections that blend together
- No sense of the vibrant, bohemian-luxury character of Casa Sempre Avanti

The property photos show a completely different story: vivid ocean blues, lush jungle greens, rich golden-yellow accent walls, turquoise and teal cushions, warm wood, thatched palapa roofs, and colorful bohemian textiles. The website needs to capture this energy.

---

## New Color Palette

Inspired directly by the property photos:

| Role | Current | New | Reasoning |
|------|---------|-----|-----------|
| Background | Pale grey-beige `36 33% 97%` | Warm cream-white `40 50% 98%` | Brighter, cleaner canvas |
| Primary | Dark navy `205 45% 22%` | Deep ocean blue `200 60% 28%` | Richer, more saturated ocean |
| Accent | Dull terracotta `24 60% 45%` | Vibrant golden-yellow `42 85% 55%` | Matches the yellow walls in photos |
| NEW: Jungle | n/a | Tropical green `160 45% 35%` | The lush vegetation everywhere |
| NEW: Turquoise | n/a | Ocean turquoise `185 55% 48%` | The cushions, the sea, the pool |
| Terracotta | `24 60% 45%` | Richer terracotta `16 70% 50%` | Warmer, more alive |
| Sand | `36 33% 97%` | Warm sand `38 45% 92%` | More golden warmth |
| Card bg | Grey `36 30% 95%` | Light sand with warmth `38 40% 95%` | Subtle tropical warmth |

---

## Layout & Shape Language

Inspired by Casa Tara's organic feel and the property's architecture (palapa roofs, curved concrete, organic materials):

### Photo Shapes (NOT all rectangles)
- Hero section photos with subtle rounded corners (rounded-2xl or rounded-3xl)
- Alternating photo layouts: some with rounded-tl-[80px] rounded-br-[80px] for an organic arch feel
- Photo mosaic sections with mixed rounded corners creating visual rhythm
- Overlapping photo compositions where one image slightly overlaps another

### Section Dividers
- Replace flat section backgrounds with subtle wave or curve SVG dividers between sections
- Use diagonal clip-path on some full-width photo sections for dynamic angles

### Cards & Containers
- Services grid cards get subtle rounded corners (rounded-xl) with a thin border in turquoise or gold
- Review cards with larger rounded corners and a left accent border in gold
- Experience cards with rounded-2xl photo frames

---

## Specific Component Changes

### 1. `src/index.css` - Complete color variable overhaul
- Update all CSS custom properties to the new vibrant palette
- Add new variables: `--jungle`, `--turquoise`, `--golden`
- Update card, muted, and secondary colors for warmth

### 2. `tailwind.config.ts` - Add new colors
- Add `jungle`, `turquoise`, `golden` to the color map
- These become usable as `bg-jungle`, `text-turquoise`, `border-golden` etc.

### 3. `src/components/home/HeroSection.tsx` - More dynamic
- Keep the full-bleed hero but add a subtle organic shape overlay (SVG wave at the bottom edge instead of a hard line)
- Make the gradient warmer (from-black/30 to golden/black blend)

### 4. `src/pages/Index.tsx` - Estate section photo treatment
- Give the carousel photos rounded-2xl corners
- Add a subtle golden border or shadow
- Make the stats section use the golden accent color for numbers

### 5. `src/components/home/ServicesGrid.tsx` - Visual upgrade
- Icons use turquoise color instead of terracotta
- Cards get rounded-xl with a subtle warm border
- Hover state uses a golden glow/shadow
- Background changes from flat grey to a subtle warm gradient

### 6. `src/components/home/FlowOfDaySection.tsx` - Organic photo shapes
- Photos get alternating rounded corners (e.g., first card rounded-tl-[60px], second card rounded-br-[60px])
- Creates a flowing, organic feel like Casa Tara's photo layout
- Text overlay on gradient uses warmer tones

### 7. `src/components/home/LocationPreview.tsx` - Visual punch
- Photo gets rounded-2xl treatment with a slight rotation or offset shadow
- Background section gets a subtle tropical green accent

### 8. `src/components/home/CulinaryPreview.tsx` - Warm & inviting
- Photo shape with organic rounded corners
- Background uses warm sand tones
- Accent list items use golden bullet points

### 9. `src/components/home/GuestReviews.tsx` - Elevated cards
- Cards get rounded-xl with left border in golden accent
- Stars use the new golden color
- Quote text in a warmer serif style
- Background section with subtle turquoise/ocean tint

### 10. `src/components/home/HospitalitySection.tsx` - Rich ocean depth
- Background changes from flat navy to a richer ocean gradient
- Photo gets organic rounded corners
- Stats use golden text for numbers

### 11. `src/components/home/QuoteSection.tsx` - Botanical feel
- Add a subtle leaf/palm SVG pattern in the background (very low opacity)
- Quote mark in golden color
- Background with warm cream gradient

### 12. `src/components/layout/Navbar.tsx` - Refined
- When solid on scroll, use the warm cream background instead of grey
- Active link color uses turquoise instead of terracotta

### 13. CTA section in Index.tsx
- Buttons use the vibrant golden-yellow accent
- Warmer overlay on the background photo

---

## Files to Change

| File | Changes |
|------|---------|
| `src/index.css` | Complete color palette overhaul with vibrant ocean/jungle/golden tones |
| `tailwind.config.ts` | Add jungle, turquoise, golden color definitions |
| `src/pages/Index.tsx` | Rounded photo shapes, warm stat colors, organic section transitions |
| `src/components/home/HeroSection.tsx` | Warmer gradient, SVG wave bottom edge |
| `src/components/home/ServicesGrid.tsx` | Turquoise icons, rounded cards, warm hover states |
| `src/components/home/FlowOfDaySection.tsx` | Alternating organic rounded corners on photos |
| `src/components/home/LocationPreview.tsx` | Rounded photo, warm accents |
| `src/components/home/CulinaryPreview.tsx` | Organic shapes, golden accents |
| `src/components/home/GuestReviews.tsx` | Elevated cards with golden left border, warmer bg |
| `src/components/home/HospitalitySection.tsx` | Richer ocean gradient bg, golden stats |
| `src/components/home/QuoteSection.tsx` | Golden quote mark, subtle botanical bg pattern |
| `src/components/layout/Navbar.tsx` | Warm cream solid state, turquoise active links |

---

## Design Philosophy

The redesign captures three core elements from the actual property:

1. **Ocean** -- Deep blues, turquoise pool water, Pacific horizon (primary + turquoise)
2. **Jungle** -- Lush palm greens, tropical vegetation, garden paths (jungle green accents)
3. **Bohemian Warmth** -- Golden walls, rich wood, colorful cushions, woven textures (golden accent, warm sand backgrounds)

Every section should feel alive, warm, and distinctly tropical-luxury -- not corporate or generic. The organic rounded shapes echo the palapa roofs and curved architecture of the villas themselves.

