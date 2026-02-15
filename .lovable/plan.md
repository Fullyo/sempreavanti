
## Fix Villa Luisa First Carousel Photo

### Problem
The `reorderPictures` function in `src/pages/Villas.tsx` tries to find Villa Luisa's preferred first photo by searching for captions containing "aerial" or URLs containing "DJI". The desired photo (`b296357f-3987-4b-2s6Ol`) has no caption and no "DJI" in its URL, so it never matches. The API returns it as the 10th photo, meaning a different photo always shows first.

### Solution
Update the `reorderPictures` function to match Villa Luisa's preferred first photo by its unique Guesty asset ID (`b296357f-3987-4b-2s6Ol`) in the URL. This is a reliable, deterministic match that will always work regardless of API ordering or caption changes.

### Technical Details

**File to modify:** `src/pages/Villas.tsx` (lines 57-66)

Change the Villa Luisa branch of `reorderPictures` from:
```
preferredIdx = pics.findIndex(
  (p) =>
    p.caption?.toLowerCase().includes("aerial") ||
    p.caption?.toLowerCase().includes("exterior") ||
    p.original?.includes("DJI") ||
    p.original?.includes("dji")
);
```

To:
```
preferredIdx = pics.findIndex(
  (p) => p.original?.includes("b296357f-3987-4b-2s6Ol")
);
```

This matches the exact Guesty photo ID in the URL, ensuring this specific photo is always moved to position 1 in the carousel, regardless of what order the API returns.
