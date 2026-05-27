## What's wrong now

1. **Distorted images** — the current `handleDownloadPDF` passes `windowWidth/windowHeight` to html2canvas and then stretches the resulting bitmap into an A4 box minus 12mm margins. The bitmap's aspect ratio (794×1123 = 1:1.414) doesn't match the target box (186×273 = 1:1.468), so html2canvas resamples and `addImage` re-stretches → squashed photos.
2. **Big white margins** — 12mm all sides + 6mm binding shift = ~18mm of white on every page. You don't want that.
3. **Capture size mismatch** — capturing at `windowWidth/windowHeight` instead of each `.page` div's own 794×1123 means content outside the page (or padding inside the viewport) gets pulled in.

## Fix

Rewrite `handleDownloadPDF` in `src/pages/ConciergeGuide.tsx` so each `.page` becomes one full-bleed A4 sheet with zero distortion.

### Capture rules (per `.page` div)

- Force the `.page` to its known print size before capture: `width: 794px`, `height: 1123px` (A4 @ 96dpi, ratio 1:1.4142).
- `html2canvas(pageEl, { scale: 2, width: 794, height: 1123, windowWidth: 794, windowHeight: 1123, useCORS: true, backgroundColor: '#ffffff', logging: false })`.
- Resulting bitmap is exactly 1588×2246 → identical aspect ratio to A4.

### PDF assembly

- `new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })` → 210×297mm, same 1:1.4142 ratio.
- `pdf.addImage(dataUrl, 'JPEG', 0, 0, 210, 297, undefined, 'FAST')` — full bleed, x=0, y=0, width=210, height=297.
- JPEG at quality 0.92 instead of PNG to keep the file under ~15MB for 32 pages.
- `pdf.addPage()` between pages; no margin math, no odd/even shift.

### Pre-capture prep

- Temporarily add a class `pdf-capturing` to `<body>` that:
  - hides `#pdf-btn-group` (so the floating buttons don't end up in the bitmap),
  - sets each `.page` to `box-shadow: none; border-radius: 0; margin: 0; transform: none`.
- Remove the class in a `finally` block.

### What stays the same

- Web layout, fonts, photos, spacing — untouched.
- The existing **Print** button stays as a fallback.
- `.page` keeps its current 794×1123 size.

### Verification

1. Open `/concierge-guide` → click **Download PDF**.
2. PDF opens to exactly 32 A4 pages, each one full-bleed (no white border).
3. Spot-check Monkey Mountain Hike and Horseback Riding pages from your screenshots: photos render at correct aspect ratio (no squashed horses, no stretched ridgeline), concierge tip box sits flush with the rest of the page.
4. File size under ~20MB.

### Files changed

- `src/pages/ConciergeGuide.tsx` — rewrite `handleDownloadPDF`, add the `pdf-capturing` body-class CSS rule. No other files touched.
