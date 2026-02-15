

## Update Homepage Hero Image and Show Full Photo

### Changes

**1. Replace hero image asset**
Copy the new uploaded photo (`VillaSempreAvantiHero1.png`) to `src/assets/hero-villa-new.png`, replacing the current file.

**2. Adjust image positioning (`src/components/home/HeroSection.tsx`, line 19)**
Add `object-[center_40%]` to the image class so the pool at the bottom of the photo is visible instead of being cropped out.

Current:
```
className="absolute inset-0 w-full h-full object-cover"
```

Updated:
```
className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
```

### What stays the same
- The gradient overlay remains at its current setting (`from-black/35 via-black/15 to-black/50`)
- All other hero section content (text, buttons, layout) unchanged

