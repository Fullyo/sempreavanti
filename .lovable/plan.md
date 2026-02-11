

# Fix Wellness Hero Image (For Real This Time)

## Root Cause

The file `wellness-hero-yoga.png` exists and is correctly imported in the code, but it contains the **wrong image data** -- it's still the old property/pool photo. Previous copy operations reported success but didn't actually overwrite the file content with the yoga group photo.

## Solution

1. **Delete** the existing `src/assets/wellness-hero-yoga.png` to clear any cached/stale file
2. **Delete** the old `src/assets/wellness-yogahero.png` as well (no longer needed)
3. **Copy** the uploaded `user-uploads://yogahero-4.png` to a brand new path: `src/assets/wellness-hero-new.png`
4. **Update** the import in `src/pages/Wellness.tsx` line 7:
   - From: `import heroImg from "@/assets/wellness-hero-yoga.png"`
   - To: `import heroImg from "@/assets/wellness-hero-new.png"`

Using a completely new filename that has never existed before, combined with deleting the old files, should ensure no stale data or caching interferes.

## Technical Details

- **Delete**: `src/assets/wellness-hero-yoga.png`
- **Delete**: `src/assets/wellness-yogahero.png`
- **Create**: `src/assets/wellness-hero-new.png` (from `user-uploads://yogahero-4.png`)
- **Modify**: `src/pages/Wellness.tsx` -- update import on line 7

