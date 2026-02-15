

## Fix Hero Image Cropping on Published Site

### Problem
The preview environment shows the full pool, but the published site crops it because different screen sizes and aspect ratios cause `object-cover` to cut off different parts of the image. The current `h-[90dvh]` constraint combined with `object-cover` means the image will always be cropped on wider screens where the viewport is shorter relative to its width.

### Solution: Make the hero taller and reposition the image anchor

Two changes to `src/components/home/HeroSection.tsx`:

**1. Increase hero height from `90dvh` to `100dvh`** (line 13)
This gives the image more vertical space to display, reducing how much gets cropped.

**2. Shift the image anchor from `object-[center_40%]` to `object-[center_60%]`** (line 18)
`60%` means the anchor point is 60% from the top, which pulls the image up and reveals more of the bottom (where the pool is). The current `40%` isn't shifting it far enough.

### File: `src/components/home/HeroSection.tsx`

```text
Line 13 (section height):
  Before: h-[90dvh] min-h-[600px]
  After:  h-[100dvh] min-h-[600px]

Line 18 (image position):
  Before: object-[center_40%]
  After:  object-[center_60%]
```

### Why this works across all screens
- Taller hero = less aggressive cropping on all viewports
- `60%` anchor = the pool area is always prioritized regardless of viewport width
- These two changes together ensure the pool is visible on desktop, tablet, and mobile

### What stays the same
- Gradient overlay (`from-black/35 via-black/15 to-black/50`)
- All text, buttons, animations
- The image file itself (already replaced)

### After implementing
You will need to click **Publish** to push the changes to the live site at villassempreavanti.com.
