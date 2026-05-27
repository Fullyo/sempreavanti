## What's wrong

**1. Smaller photos distorted in PDF (crystal clear on web).**
The hero photos were fixed last round by converting them to `background-image` divs because `html2canvas` does NOT honor `object-fit: cover` on `<img>` tags — it stretches the raw image to fill the container, which reads as distortion.

Every remaining `<img class="square-image">` (the paired thumbnails on Ally Cat, Fat Cat, Private Boat, Panga, Spearfishing, etc.) and every `<img>` inside `.utv-card` has the same problem. On web the browser respects `object-fit:cover` so they look perfect; in the PDF they're stretched.

**2. Yellow pill text "not centered."**
`.section-header` uses `display:flex; justify-content:space-between`. On pages where the header has both a title and a badge, the badge sits flush right (looks fine). But on pages where the only child is the badge — or where the badge wraps onto two short lines — the layout reads as the pill jammed to the right edge with the text inside it visually off-center because of `text-align:right`. The user wants the pill text reading as centered.

**3. Make photos bigger but not overflow.**
There's slack on most pages. Hero can grow from 180 → 210px and tall hero from 220 → 260px without pushing content past 1123px. Square-image height can grow from 200 → 230px. The dev-time overflow warning loop (already in code) will tell us if anything tips over — we adjust per-page if so.

## The fix (all in `src/pages/ConciergeGuide.tsx`)

### A. Cure the distortion — convert ALL content imgs to background-divs at capture time

Rather than rewriting ~40 inline `<img>` tags, add a generic conversion step to `handleDownload` (already does this for heroes). Before the `html2canvas` loop:

1. Find every `<img>` inside `.page` that has CSS `object-fit:cover` (square-image, utv-card img).
2. For each, record original parent HTML / dimensions, then replace the `<img>` with a sibling `<div>` whose inline style is `width:100%; height:<measured>px; background-image:url(...); background-size:cover; background-position:<computed object-position>; border-radius:<inherited>;`.
3. Run the existing capture loop.
4. In the `finally` block, restore the originals from the saved references so the on-screen view is unchanged after download.

This is the same technique that fixed the hero, applied uniformly. No HTML/CSS changes needed in the body of the document, so nothing else in the doc can shift.

### B. Center the yellow pill

Update `.section-header` and `.gold-badge` so the pill text reads centered:

```css
.section-header {
  background:#2e7b8c; color:#fff;
  padding:12px 20px; border-radius:6px;
  font-family:'Cormorant Garamond',serif; font-size:1.4rem;
  display:flex; justify-content:space-between; align-items:center;
  gap:16px; margin-bottom:24px;
}
.gold-badge {
  background:#f0b429; color:#2c2c2c;
  padding:6px 16px; border-radius:14px;
  font-family:'Montserrat',sans-serif; font-size:.7rem; font-weight:700;
  text-transform:uppercase;
  white-space:normal;
  text-align:center;          /* was right — this is the visible fix */
  max-width:60%;
  line-height:1.3;
  flex-shrink:0;
}
```

Two changes only: `text-align:center` (the pill text reads centered) and slightly more vertical padding so wrapped 2-line pills don't look squashed.

### C. Make photos bigger within page slack

In the `STYLES` block:
- `.hero-image { height:210px; }` (was 180)
- `.hero-image.tall { height:260px; }` (was 220)
- `.square-image { height:230px; }` (was 200)
- `.utv-card img { height:220px; }` (was 200)

The existing `useEffect` already logs `[ConciergeGuide] Page N overflows: …` to the console for any page > 1123px. After change, the very next page reload tells us if any page tipped over; we'll dial that specific page back (only that page) — no global undo.

## Why this won't break the rest of the document

- The img→div conversion happens only during the brief PDF capture and is fully reverted in `finally`. The on-screen view is byte-identical before and after download.
- The 4 CSS height bumps + 2 `.section-header`/`.gold-badge` tweaks are the only style changes. No grid, padding, page height, font-size, or copy edits.
- Pages without `.square-image`, `.utv-card`, or `.gold-badge` (cover page, house essentials text-only pages, emergency contacts) are untouched.

## Verification before handing back

1. Hard-reload `/concierge-guide`, watch console for any `[ConciergeGuide] Page N overflows` warnings — adjust only the offending page if any.
2. Click Download Guide (PDF).
3. `pdftoppm` the PDF to JPEGs; open all 22 pages.
4. Confirm: every square image and UTV photo is uncropped/undistorted (correct aspect), heroes look proportional, the yellow pill text reads centered, no content clipped at the page bottom.

## Files changed

- `src/pages/ConciergeGuide.tsx` — only. STYLES block (6 rules) + `handleDownload` (one extra preprocessing step + restore).
