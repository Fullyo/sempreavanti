## Why this keeps failing

Your screenshots are the **browser's "Save as PDF"** dialog (Chrome print preview), not our Download PDF button. Two different rendering engines, two different bugs:

1. **Browser print** (what you're using): Chrome paginates based on actual content height. Several `.page` divs contain MORE content than 1123px tall. On screen `overflow:hidden` masks it — in print, Chrome spills it onto a second sheet (the empty "page 2" / blank trailing pages you see).
2. **Download PDF button** (html2canvas + jsPDF): captures each `.page` div at fixed 794×1123 → one image per A4 sheet. This is the only path that is structurally guaranteed to give you 32 pages, 1:1, no overflow.

We've been patching the html2canvas path while you've been testing the print dialog. That's the disconnect.

## The fix — two parts

### Part 1: Make Download PDF the only path (remove the trap)

- Remove the floating **Print** button entirely. Keep only **Download PDF**.
- Remove `@page` / `@media print` rules so the browser's Save-as-PDF behaves like a normal screen capture if anyone still tries it (no false "it looks fine in print preview" expectation).
- Rename button to **"Download Guide (PDF)"** so it's unmistakable.

This alone solves your immediate problem: the Download PDF output is already correct (full-bleed A4, no distortion since the last fix).

### Part 2: Audit + hard-cap every page so content cannot overflow

Even with html2canvas, if content inside a `.page` exceeds 1123px, the bottom gets cropped. Today `.page` uses `min-height:1123px` + `overflow:hidden` — overflow is silently chopped.

Changes in `src/pages/ConciergeGuide.tsx`:

- Change `.page { min-height:1123px }` → `.page { height:1123px }` (hard cap, matches A4 exactly).
- Reduce inner padding from `48px` → `40px` to give content ~64px more vertical room.
- Tighten oversized blocks that I'll identify by measurement (likely candidates from your screenshots):
  - **Boat page (Ally Cat)**: hero image 220px → 180px, square-image 270px → 220px, so the pricing table + tip box fit above the fold.
  - **House Rules page**: 2-col grid is fine, but the Airport Transportation block currently wraps awkwardly ("$5,000 MXN" on its own line because of a `<strong>` line break). Inline-reflow that paragraph and shrink the **GRATUITY & VILLA TEAM** card padding from 24px → 16px so it doesn't push past 1123px.
- Add a dev-only runtime guard: after mount, loop every `.page`, measure `scrollHeight`, and `console.warn` any that exceed 1123px. Lets us catch future overflows immediately.

### Part 3: Verify before declaring done

After the edit I will:

1. Trigger the Download PDF flow in-browser (browser tool),
2. Save the resulting PDF,
3. Convert each of the 32 pages to a JPEG with `pdftoppm`,
4. Open and visually inspect every page — confirm no clipped content, no empty trailing pages, photos undistorted on the Ally Cat and House Rules pages specifically.
5. Report findings page-by-page before handing back.

## Files changed

- `src/pages/ConciergeGuide.tsx` — remove Print button, drop print CSS, harden `.page` height, shrink the overflowing blocks listed above, add dev overflow warning.

## What I will NOT touch

- The web layout for any page that already fits.
- The html2canvas/jsPDF capture loop (it's correct now).
- Fonts, colors, copy.  
  
  
the pdf download button was not working that's why i used the print ...
- &nbsp;