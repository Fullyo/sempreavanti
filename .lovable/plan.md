## Problem

The web layout for the concierge guide is sized to exact A4 dimensions already: `.page` is `794px × 1123px` with `48px` padding, which equals 210×297mm at the browser's standard 96dpi. So if we print the web layout as‑is, it lands 1:1 on A4.

The current `@media print` block fights this by:
- Rewriting `.page` to `210mm × 297mm` with `14mm 12mm` padding (a narrower content box than the web).
- Forcing `hero-image` down from 220px → **160px**, `square-image` from 270px → **195px**, `utv-card img` from 200px → **160px**, `hero-image.tall` from 500px → **180px**, `hero-image.no-crop` to `max-height 160px`.
- Shrinking font sizes (`.description .85rem`, `.tip-box .78rem`, table cells `.82rem`, etc.) and tightening margins.

Result: in print every photo is dramatically smaller than on the web, leaving the empty space the user is seeing (e.g. Monkey Mountain hero, Ally Cat hero), and the proportions no longer match the curated web design.

## Fix

Replace the print block with a minimal one that keeps web sizing intact and only does what print actually needs.

### New `@media print` rules

```css
@page { size: A4 portrait; margin: 0; }

@media print {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
  }

  /* One web .page == one A4 sheet, untouched. 794px × 1123px ≡ A4 at 96dpi. */
  .page {
    box-shadow: none !important;
    margin: 0 !important;
    border-radius: 0 !important;
    page-break-after: always;
    break-after: page;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .page:last-of-type {
    page-break-after: auto;
    break-after: auto;
  }

  #print-btn { display: none !important; }
}
```

That's it. Remove every `!important` override on `.hero-image`, `.hero-image.no-crop`, `.hero-image.tall`, `.square-image`, `.utv-card img`, `.section-header`, `p.description`, `.image-row`, `.top-five-item`, `.pricing-table`, `.tip-box`, `.inclusions-list`, `.utv-grid`, `.grid-list`, `.grid-item p`, `.page.cover`. The base (web) CSS already handles all of those correctly at A4 scale.

### Why this resolves every reported symptom

- **Photos shrunk / empty space on PDF**: gone — images render at their web heights (220 / 270 / 500 / 200 px), matching the screenshots the user calls "perfect".
- **Inconsistencies page‑to‑page**: gone — there is no longer a separate print sizing system to drift from web sizing.
- **Bottom‑of‑page cutoffs from earlier iterations**: the previous cutoffs were caused by `max-height: 297mm; overflow: hidden` combined with content laid out for `1123px` (which is *slightly* taller than 297mm in some browsers' print rasterization). Removing the forced `mm` height lets the natural `min-height: 1123px` + `page-break-after: always` give each section its own sheet, with no clipping. The web content has been authored to fit, so as long as we don't change its sizing, it fits.

## Files

- `src/pages/ConciergeGuide.tsx` — replace lines ~1173–1242 (the `@page` block and the entire `@media print { … }` block) with the minimal version above. No other changes.

## Verification

After editing:
1. Reload `/concierge-guide` in the preview.
2. Use the in‑page "Print / Save as PDF" button → Save as PDF (A4, margins: None, background graphics: on).
3. Spot‑check the pages the user flagged: Welcome (gratuity box), Ally Cat (page 5), Fat Cat (page 6), Monkey Mountain (page 15) — hero/square photos should match the web exactly and no content should be clipped at the bottom.
