

## Fix Footer Section

### 1. Replace footer image with uploaded `diner.jpg`
Copy `user-uploads://diner.jpg` to `src/assets/diner.jpg` and use it as the background for the bottom section, replacing `menuHeroOldImg`.

### 2. Change CTA content — no button, informative nudge
Remove the "Meet the team behind every meal" heading and the "The Chef Experience" button link. Replace with:
- A warm heading like *"Have dietary preferences or special requests?"*
- A soft subtitle nudging them to email: *"Simply reply to your booking confirmation and let us know — our chefs will take care of the rest."*
- No button, no link — purely informative text that reminds guests to use their email thread.

### 3. Remove unused import
Remove the `Link` import from `react-router-dom` if no longer used elsewhere on the page (it isn't). Also remove the `menuHeroOldImg` import.

### Files Changed
- **`src/assets/diner.jpg`** — new asset copied from upload
- **`src/pages/Menu.tsx`** — swap image, rewrite bottom section content, clean imports

