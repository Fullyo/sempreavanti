# Make the meal planner feel like a menu, not a form

The guest-facing planner (`src/pages/MealPlanner.tsx`, route `/meals/:token`) currently reads like an admin form: a dark text block, three info cards, then plain `<select>` dropdowns per day. Goal — make guests *excited to order* while keeping the exact same data model, save logic, and meal-time/Sunday/arrival rules untouched.

## What changes (visual only)

### 1. Photographic hero header (i dont know if you want the hero to be an image since that where we have the name of the guest ... thats important too) reconsider

Replace the flat dark text header with a real image hero, reusing the "Our Kitchen" hero photo (`menu-hero-beach.png`, already in `src/assets`) behind a dark gradient — consistent with the public `/menu` page and the site's editorial luxury style.

- Keep the personalized greeting ("{guest}, plan your meals"), the arrival→departure chip, and the "View the full menu →" link, but laid over the photo in white with the gold accent.
- Keep the check-in/checkout explainer line.

### 2. Keep the two info cards, tighten them

The "How dining works" and "Daily service times" cards stay (same approved copy), but restyled to sit on the warm cream background as lighter, more elegant cards so they don't compete with the ordering flow.

### 3. Replace dropdowns with visual selection cards — the core change

For each meal slot, instead of a `<select>`, show the dish options as **selectable cards/chips** the guest taps:

- Each meal slot (Breakfast, Lunch appetizer, Lunch, Dinner appetizer, Dinner, Dessert) becomes a labeled section.
- Dish options render as tappable pills/cards showing the dish **name + short description**; the selected one highlights with the gold accent and a check.
- A subtle "No meal this day" / "None" option remains per slot (preserving the current `__skip__` and empty states).
- Selection still writes to the same `sel` state keyed by `${day}|${course}` — autosave and the save button are unchanged.

This turns each day into a browsable menu the guest actively picks from, rather than hunting through dropdowns.

### 4. Day cards polished

- Each day gets a cleaner header (Day N + date) with the arrival/departure/Sunday tags kept exactly as-is.
- Optional: a small food photo accent per day header for warmth (using existing `chef-*`/`food*` assets), kept tasteful and light.

### 5. Full-menu overview & special requests

- Keep the collapsible "View full menu" section and the dietary/special-requests textarea; restyle for consistency.
- Keep the autosave bar and "Save selections" button, restyled to match.

## Explicitly unchanged

- `meal-plan` edge function calls (get/save), selection payload shape, `slotsForDay` arrival/checkout logic, Sunday no-service handling, set meal times (8:30 / 12:30 / 5:30), and all agreed dining copy.
- No database or backend changes.

## Technical notes

- All work stays inside `src/pages/MealPlanner.tsx` (it uses a local inline-style `C` palette; I'll extend that same palette rather than introduce hardcoded colors elsewhere).
- Reuse existing assets (`menu-hero-beach.png`, chef/food images) — no new image generation needed unless you want fresh food photography.

Want me to also add a small food photo to each day header, or keep it text-forward and clean? no