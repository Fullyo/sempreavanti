## Menu Page Updates

### Changes to `src/pages/Menu.tsx`

**1. Hero image -- use a food photo instead of chef-hero**

- Switch hero from `chef-hero.jpeg` to `food1.jpeg` (or `food3.jpeg`) -- an actual food photo sets the right tone for a menu page.

**2. Category header naming -- English first, Spanish subtitle**

- **Breakfast** (main) / *Desayuno* (sub) -- currently reversed
- **Lunch & Dinner** (main) / *Almuerzo / Cena* (sub) -- currently reversed
- **Desserts** (main) / *Postres* (sub) -- currently reversed
- **Appetizers** / *Entradas* -- already correct, no change

**3. Move Pizza Night inside the menu card, after Desserts**

- Remove the separate standalone Pizza Night section below the menu card
- Instead, place "Pizza Night" as a styled callout at the bottom of the Desserts column (or as a 5th item spanning the bottom of the grid) to fill the visual gap
- Restyle it as a warm, inviting "Guest Favorite" card that sits within the parchment container -- golden accent border, smaller scale, integrated feel rather than a big dark block

**4. Use pizza emoji in the bottom CTA footer area**

- Add a 🍕 accent near the bottom CTA section

### Specific data changes

```
Before:                          After:
title: "Desayuno"                title: "Breakfast"
subtitle: "Breakfast"            subtitle: "Desayuno"

title: "Almuerzo / Cena"         title: "Lunch & Dinner"  
subtitle: "Lunch & Dinner"       subtitle: "Almuerzo / Cena"

title: "Postres"                 title: "Desserts"
subtitle: "Desserts"             subtitle: "Postres"
```

### Pizza Night placement

The Desserts column has 9 items while Lunch/Dinner has 11. Pizza Night as a styled card at the bottom of the Desserts column creates visual balance in the 2-col grid. It will use a warm golden accent style (border-accent, bg-accent/10) with the 🍕 emoji and "Guest Favorite" label -- fitting naturally inside the menu card rather than breaking out as a separate dark section.

### Files changed

1. `src/pages/Menu.tsx` -- all changes in this single file  
  
  
i agree but no emogi, that is cheap for this beuty website