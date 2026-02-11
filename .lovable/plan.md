

# Fix Wellness Page Hero Image

## Problem
The hero image on the Wellness page still shows the old property/pool photo instead of the yoga group photo you uploaded. The import path in the code is correct (`wellness-yogahero.png`), but the actual file on disk hasn't been properly replaced.

## Solution
1. Copy `user-uploads://yogahero-4.png` to a **new filename** `src/assets/wellness-hero-yoga.png` to avoid any caching or file-replacement issues with the old filename.
2. Update the import in `src/pages/Wellness.tsx` line 7 to reference the new file:
   - Change: `import heroImg from "@/assets/wellness-yogahero.png"`
   - To: `import heroImg from "@/assets/wellness-hero-yoga.png"`

Using a completely new filename ensures there are no stale cache or build artifacts from the previous file.

## Files
- **Create**: `src/assets/wellness-hero-yoga.png` (copied from uploaded yoga group photo)
- **Modify**: `src/pages/Wellness.tsx` -- update hero image import on line 7

