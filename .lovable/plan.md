## Why the current approach keeps failing

Browser "Save as PDF" re-flows the page using the browser's print engine. Even though our `.page` divs are sized to A4 at 96dpi (794×1123px), the print engine:

- Rounds px→mm differently across Chrome versions, pushing 1–3px of content onto a second sheet (this is exactly what your screenshots show — the gratuity box header is on page 2, its body bleeds to page 3; the Ally Cat pricing table is split from its hero photo).
- Honours/ignores `@page margin: 0` inconsistently when the user leaves "Margins: Default" in the print dialog (your screenshots show "Margins: Default", which adds ~10mm and guarantees overflow).
- Re-rasterises images and fonts, so any CSS tweak we make to fight overflow distorts the design we want to preserve.

No amount of `@media print` tuning will make this reliable. We need to stop relying on the browser's print engine.

## New approach: rasterise each page to an image, assemble a PDF

We keep the web layout exactly as it is today (the version you called "beautiful and perfectly curated") and add a dedicated **Download PDF** button that:

1. Iterates over each `.page` div in `ConciergeGuide.tsx`.
2. Uses `html2canvas` to capture that div at 2× scale (sharp, print-quality).
3. Uses `jsPDF` to drop each capture onto its own A4 sheet, centred, with a configurable binder margin (default **12mm** all sides, extra **6mm** on the inside edge for hole-punching).
4. Saves `Villas-Sempre-Avanti-Concierge-Guide.pdf`.

Because each web page is captured as a single image and placed on a single A4 sheet, **content cannot spill across pages**. What you see on screen is exactly what lands in the PDF. No browser print dialog involved.

The existing "Print / Save as PDF" button stays as a fallback but the new button becomes the default, labelled **Download PDF (Print-Ready)**.

## Binder-friendly margins

A4 = 210×297mm. Each captured page image is scaled to fit inside 186×273mm (12mm margin all sides) and shifted 6mm right on odd pages / 6mm left on even pages so the binding edge always has extra clearance. Backgrounds inside the captured image stay full-bleed visually because the surrounding A4 margin is white.

If you want zero margins instead (full-bleed), it's a one-line constant change.

## Web layout adjustments

To guarantee each `.page` div fits inside the captured frame with no internal scrolling:

- Add `overflow: hidden` to `.page` (web view unaffected — content already fits).
- Remove the existing aggressive `@media print` overrides — they are no longer needed because we no longer use browser print.
- Keep `.page` at its current 794×1123px size.

No visual redesign. No font shrinking. No image resizing.

## Files to change

- `src/pages/ConciergeGuide.tsx`
  - Add `html2canvas` + `jspdf` imports.
  - Add `handleDownloadPDF()` that loops `.page` divs and builds the PDF.
  - Replace the print button with two buttons: **Download PDF (Print-Ready)** (primary) and **Print** (secondary fallback).
  - Strip the `@media print` block down to the minimum (`#print-btn { display:none }`).
  - Add `overflow: hidden` to `.page`.

- `package.json` — add `html2canvas` and `jspdf` (installed via `bun add`).

## Verification

1. Open `/concierge-guide`, click **Download PDF (Print-Ready)**.
2. Confirm the resulting PDF is exactly 32 single A4 pages, each one a 1:1 visual match of the corresponding web `.page`.
3. Spot-check Welcome (gratuity box intact on one page), Ally Cat (hero + pricing table on one page), Fat Cat, Monkey Mountain.
4. Confirm 12mm binder margin on all sides and extra clearance on the binding edge.

## Why this will work where previous attempts didn't

Previous fixes all tried to make the browser print engine cooperate. This approach removes the browser print engine from the equation entirely — each PDF page is a flat image of the web page, so PDF fidelity becomes a property of the web render, which we already control.
