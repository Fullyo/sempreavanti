## What's wrong

Two visual bugs left in the PDF. Both are isolated to CSS rules + a few inline overrides in `src/pages/ConciergeGuide.tsx`. Nothing else in the document is touched.

### 1. Hero photos look distorted on some pages

The base rule is fine:
```css
.hero-image { width:100%; height:180px; object-fit:cover; }
```
But several pages override it inline with awkward heights that fight `object-fit:cover` and look squished or off-center after html2canvas rasterizes them:
- `fatcat-hero.jpg` → `style="height:150px"` (too short, faces cropped)
- `private-boat-hero.jpg` → `style="height:280px"` (pushes page content down, gets compressed)
- `panga.jpeg` → `style="height:280px"` (same)
- `dining-sayulita-v2.jpg` → `style="height:150px"`
- Ally Cat uses `class="hero-image no-crop"` → `object-fit:contain` on transparent bg, which renders with letterboxing that reads as distortion

### 2. Yellow pill ("gold-badge") text overflows or looks oversized

Current rule:
```css
.gold-badge { white-space:nowrap; font-size:.75rem; padding:4px 12px; }
```
On pages with long pricing strings (e.g. "$3,000 MXN UP TO 5 · +$600/EXTRA ADULT", "$8,500 MXN ALL-INCLUSIVE 4HR · +$1,500/EXTRA HR"), `nowrap` forces the pill wider than the header, sometimes clipping or pushing the section title to a second line. On short labels it looks correctly sized — that's the inconsistency the user is calling out.

## The fix (CSS-only, in `src/pages/ConciergeGuide.tsx`)

**Hero photos — normalize to one rule, drop the inline height overrides**

1. Update base rule to be tolerant of all hero source aspect ratios:
   ```css
   .hero-image {
     width:100%; height:180px;
     object-fit:cover; object-position:center 40%;
     border-radius:8px; margin:12px 0; display:block;
   }
   .hero-image.tall { height:220px; }  /* keep for the few pages that need more */
   ```
2. Remove `class="no-crop"` from the Ally Cat hero and delete the `.no-crop` rule (it was the cause of the letterboxed/distorted look).
3. Remove the inline `style="height:150px"` and `style="height:280px"` overrides on: Fat Cat, Private Boat, Panga, Dining Sayulita. They all fall back to the standard 180px and render cleanly.
4. For the two pages that genuinely need more vertical hero (private boat + panga, since those pages have less content), add `class="hero-image tall"` instead of an inline height — capped at 220px so the page still fits 1123px.

**Yellow pill — let it shrink/wrap gracefully**

```css
.gold-badge {
  background:#f0b429; color:#2c2c2c;
  padding:4px 12px; border-radius:14px;
  font-family:'Montserrat',sans-serif;
  font-size:.7rem; font-weight:700;
  text-transform:uppercase;
  white-space:normal;          /* allow wrap on long strings */
  text-align:right;
  max-width:55%;               /* never crowds the title */
  line-height:1.25;
  flex-shrink:0;
}
.section-header { gap:12px; }   /* breathing room when pill wraps */
```

Effect: short labels look identical to today; long labels wrap to 2 lines inside the pill and the header height grows by ~10px — well within the per-page slack.

## Why this won't break the rest of the document

- All edits are in the `<style>` block + 6 inline `style=`/`class=` removals.
- No `.page` heights change, no padding changes, no grid changes.
- Pages that don't use `.hero-image`, `.no-crop`, or `.gold-badge` are untouched.
- The Download PDF capture loop, fonts, colors, copy: not touched.

## Verification before handing back

1. Trigger Download PDF in-browser.
2. `pdftoppm` each page to JPEG.
3. Spot-check every page that had an inline hero override (Fat Cat, Ally Cat, Private Boat, Panga, Dining Sayulita) + 3 pages with long pill text (Sound Bath, Fat Cat, Private Boat).
4. Confirm: heroes uncropped/undistorted, pills fit inside the teal header, no content clipped at the bottom of any page.

## Files changed

- `src/pages/ConciergeGuide.tsx` — only.
