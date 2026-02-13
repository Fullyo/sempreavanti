

# Step 1: Remove the Wellness Hero Image Completely

This is a trust-building step. No new image yet -- just prove the hero section changes.

## What will change

In `src/pages/Wellness.tsx`:

1. **Remove line 7** -- delete the `const heroImg = "https://..."` line entirely
2. **Remove the `<img>` tag** in the hero section (around line 47) that displays the hero image
3. **Set a solid background color** (dark/black) on the hero section so it still looks intentional without an image

The hero section will display as a dark banner with just the "Wellness" title text and navigation arrows -- no image at all.

## Why this matters

If the hero image disappears after this change, it proves the code update works and we can confidently add the correct image in a follow-up step.

## Files modified

- `src/pages/Wellness.tsx` -- remove hero image URL constant and the `<img>` element from the hero section

