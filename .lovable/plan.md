

## Menu Page Updates

### 1. Use uploaded photo for hero and footer CTA
Copy `foodbeach.jpg` to `src/assets/` and use it as both the hero image and the bottom CTA background (replacing `menu-hero.jpg` and `food3.jpeg`).

### 2. Rebalance menu -- Pizza Night back into Desserts column
Move Pizza Night back inside the Desserts category as a special callout at the bottom of that column (not as a regular menu item, but as a styled highlight box within the column). This balances the grid: Breakfast 13, Appetizers 10, Lunch & Dinner 11, Desserts 9 + Pizza Night callout. Remove the standalone Pizza Night banner section.

### 3. Readability improvements (subtle, not a revamp)
These are targeted tweaks to make items easier to scan without changing the overall structure:

- **Alternate subtle background on items** -- give every other menu item a very faint `bg-accent/5` background strip so the eye can track across name-to-description more easily (like a ledger/zebra stripe effect, very subtle)
- **Bolder item names** -- bump item name weight from `font-medium` to `font-semibold` for stronger contrast against the lighter descriptions
- **Slightly more vertical spacing** between items (increase `space-y-1` to `space-y-2`) so they don't feel cramped
- **Add a thin gold underline accent** under each category header to give more visual separation between the header and the items
- **Remove the tiny diamond ItemDivider SVGs** -- they add visual noise. The zebra striping and extra spacing will provide enough separation

### Files Changed
1. **`src/pages/Menu.tsx`** -- all changes above (hero/footer image swap, Pizza Night back in Desserts, readability tweaks)
2. **Copy `foodbeach.jpg`** to `src/assets/foodbeach.jpg`

