
# Villas Page Updates

## 1. Replace "Flexible Sleeping Configurations" Background Image
- Copy `DJI_0948.jpg` to `src/assets/` (e.g., as an estate asset or dedicated name)
- Update line 201 in `Villas.tsx` to use this new image instead of `estate4`

## 2. Set Specific First Photos for Each Villa Carousel
The Guesty API returns photos in its own order. The screenshot shows:
- **Casa Pietro**: White villa exterior with palapa roofs, stone walls, and stairs (Guesty caption: "Casa Pietro", currently the 3rd photo)
- **Villa Luisa**: Aerial shot of the orange/terracotta villa with pool (likely captioned with an aerial/exterior description)

**Approach**: In `Villas.tsx`, after fetching the Guesty data, reorder each villa's `pictures` array to move the desired exterior/aerial photo to position 0 before passing to `VillaCarousel`. This will be done by matching on caption keywords:
- For Casa Pietro: find the photo captioned "Casa Pietro" and move it to front
- For Villa Luisa: find the aerial/exterior photo and move it to front

If caption matching proves fragile, a fallback approach will use the Guesty photo URL fragments to identify the correct images.

## 3. Clean Up Villa Luisa Description (Remove Checkmarks, Match Style)
The Guesty `publicDescription.summary` for Villa Luisa contains checkmark characters and reads differently from Casa Pietro's. 

**Approach**: Instead of displaying raw Guesty descriptions, provide curated fallback descriptions directly in `Villas.tsx` for both villas so they match in length and editorial style. This ensures:
- No checkmarks or bullet-style formatting from Guesty
- Both descriptions are similar in tone, length, and structure
- Consistent with the luxury editorial voice of the site

## Technical Details

### Files to modify:
- **`src/pages/Villas.tsx`**:
  - Add import for new DJI_0948 asset
  - Replace `estate4` reference in the Sleeping Config section (line 201) with the new image
  - Add logic to reorder villa pictures arrays (move exterior photos to index 0)
  - Replace the raw Guesty description output (line 140) with curated text for each villa, keyed by villa ID or nickname

### New asset:
- Copy `user-uploads://DJI_0948.jpg` to `src/assets/` (e.g., `estate-sleeping.jpg` or similar)

### Description approach:
```text
Casa Pietro: ~2-3 sentences describing the intimate 2BR villa, its design, and ocean views
Villa Luisa:  ~2-3 sentences describing the spacious 3BR villa, its pool, and outdoor living
```
Both will be written in the same editorial tone without any special characters or checkmarks.
