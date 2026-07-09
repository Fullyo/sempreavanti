# Menu page public + dining fine print + set meal times

## 1. Make the Menu page public in navigation
- Add **Menu** to the "The Estate" dropdown in `Navbar.tsx` (desktop + mobile), placed right after "In-Villa Chef" as `{ label: "Menu", path: "/menu" }`.
- Keep it also reachable from the Chef page (see #2). This satisfies "both".
- The `/menu` route already exists in `App.tsx` and is indexable via SEO — no route change needed.

## 2. Cross-link the Chef page and Menu page
- Chef page (`/chef`) already has a "View Full Menu" → `/menu` button; keep it and make it clearly primary.
- On the Menu page, add a link/button back to the **In-Villa Chef** page so browsing flows both ways.

## 3. Add the dining pricing fine print (the important part)
Add a clearly styled "How dining works" / "About our dining" block. It will appear in **two** places, worded the same:
- On the **public Menu page** (`Menu.tsx`), as a highlighted panel near the top.
- On the **guest meal planner** (`MealPlanner.tsx`), so guests see it right where they select — this replaces the current one-line "food costs are additional" note with the fuller, clearer version.

Proposed copy (no percentage named, per your preference):

> **Dining at cost — with everything taken care of**
> Your groceries are purchased fresh from local markets and passed on to you **at cost**. A modest handling fee is added on top so you can simply relax while everything is done for you — the daily **shopping, prepping, cooking, and cleaning** — along with the pantry staples, oils, spices, and sauces that season every dish.
> This keeps chef-prepared, in-villa dining far more affordable than eating out, while fairly covering the basic operating costs of a fully staffed kitchen. Final food charges are based on market pricing for what you select.

I'll refine wording during build; the substance (at cost + modest handling fee covering shopping/prep/cooking/cleaning + basic operating costs, cheaper than restaurants) stays as above.

## 4. Set fixed meal times (locked)
Replace the current editable breakfast/lunch time inputs on the meal planner with **locked, displayed** set times, plus a note that special requests can be made:
- **Breakfast — 8:30 AM**
- **Lunch — 12:30 PM**
- **Dinner — ready at 5:30 PM** (left warm in the oven; enjoy whenever you wish)
- Note: *"These are our standard service times — special requests can be made and we'll do our best to accommodate."*
- Note: *"A private plated chef dinner can be arranged at an additional cost."*

These same set times will also be listed on the public Menu page so browsers see them.

## 5. Collapsible menu overview on the planner
- Add a **"View full menu"** collapsible panel at the top of the planner (`MealPlanner.tsx`), **closed by default**, that expands in place to show the categorized dish list (breakfast / appetizers / mains / desserts) pulled from the same `dishes` data already loaded. Keeps the page uncluttered.
- The existing "View the full menu →" link to `/menu` stays as a secondary option.

## Technical notes
- Frontend/presentation only — no database or edge-function changes.
- `MealPlanner.tsx` change: remove the free-text `breakfast_time` / `lunch_time` inputs from the UI and stop sending them on save (fields can remain in the backend, just unused); add the fixed-times display, the fine-print block, and the collapsible menu overview built from `dishesByCourse`.
- `Menu.tsx`: add the dining fine-print panel, the set meal times, and a link to the Chef page.
- `Navbar.tsx`: add the Menu item to "The Estate" (desktop + mobile lists).
- No changes to meal-selection logic, Sunday handling, or arrival/departure day rules.

## Files to edit
- `src/components/layout/Navbar.tsx`
- `src/pages/Menu.tsx`
- `src/pages/Chef.tsx` (minor link emphasis)
- `src/pages/MealPlanner.tsx`
