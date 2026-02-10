

# Improve Experience Pages, Fix CTA Sections, and Add Looping Navigation

## Three Changes

### 1. Make navigation arrows loop continuously

**File: `src/components/PageNavArrows.tsx`**

Update the `getPageNav` function so that when you're on the first page, "prev" wraps to the last page, and when you're on the last page, "next" wraps to the first page.

```text
Current: Surfing [prev: none] ... Cultural [next: none]
New:     Surfing [prev: Cultural] ... Cultural [next: Surfing]
```

Same for estate pages: Villas wraps to Staff, Staff wraps to Villas.

### 2. Fix the boring CTA bottom sections (solid blue on blue footer)

The problem: Most pages end with a `bg-primary` CTA section that's the same dark blue as the footer, creating a monotonous block of blue. The reference screenshot shows this exact issue.

**Solution**: Replace the solid `bg-primary` CTA sections with a background-image approach using one of the estate photos (or a relevant page photo) with a dark overlay, similar to how the homepage CTA already works. This creates visual separation from the footer while maintaining readability.

Pages affected (all pages with `bg-primary` CTA at the bottom):
- `src/pages/experiences/Surfing.tsx` -- use a surf/ocean photo
- `src/pages/experiences/Boats.tsx` -- use fishing photo
- `src/pages/experiences/Golf.tsx` -- use placeholder (no golf asset yet)
- `src/pages/experiences/Ocean.tsx` -- use whale or marietas photo
- `src/pages/experiences/Land.tsx` -- use ATV or horseback photo
- `src/pages/experiences/Cultural.tsx` -- keep primary bg but add subtle texture/gradient variation
- `src/pages/Villas.tsx` -- already has photo-backed CTA, keep as-is
- `src/pages/Wellness.tsx` -- the Sound Bath section is bg-primary mid-page (keep), but the bottom CTA uses bg-card (fine, no clash)
- `src/pages/Staff.tsx` -- small bg-primary nav section, swap to photo-backed
- `src/pages/Weddings.tsx` -- use wedding placeholder or estate photo
- `src/pages/PrivateEvents.tsx` -- use estate photo
- `src/pages/Location.tsx` -- Safety section at bottom uses bg-primary, swap to photo-backed

For pages without dedicated photos yet, use estate gallery images (estate-1 through estate-16) as atmospheric backgrounds with a dark gradient overlay.

### 3. Add individual PhotoPlaceholders for each activity listing

Currently, experience pages list activities as text-only items in a two-column grid. Each activity should have its own `PhotoPlaceholder` beside it (or above it) so photos can be added later.

Pages and approach:
- **Surfing**: Add a `PhotoPlaceholder` for each of the 6 surf breaks in the grid
- **Boats**: Add placeholders for each boat tour and each sailing vessel
- **Golf**: Already has `PhotoPlaceholder` per course -- good
- **Ocean**: Add placeholders for each water activity
- **Land**: Add placeholders for each land activity
- **Cultural**: Add placeholders for each cultural experience and dining spot

Layout change: Convert the current two-column text grid into a card-based layout where each activity gets a photo placeholder above its name and description, similar to how Golf already does it with `PhotoPlaceholder` + text per course.

## Technical Details

**`src/components/PageNavArrows.tsx`**
- Modify `getPageNav` to wrap around: when `idx === 0`, set `prev` to the last item; when `idx === pages.length - 1`, set `next` to the first item

**Experience pages (Surfing, Boats, Ocean, Land, Cultural)**
- Change each activity listing from a simple `border-b` text block to include a `PhotoPlaceholder` (aspect-ratio "video") above the activity name
- Use a consistent card layout across all experience pages

**CTA sections (multiple files)**
- Import a relevant photo (or estate fallback) at the top of each file
- Replace `bg-primary` with a relative-positioned section containing an `<img>` background + dark gradient overlay
- Keep all text, buttons, and `PageNavArrows` as-is, just change the section background treatment
- The gradient overlay ensures text remains readable: `bg-gradient-to-b from-black/50 via-black/40 to-black/60`

**Footer** (`src/components/layout/Footer.tsx`)
- No changes needed -- the fix is about making the section above it visually distinct

