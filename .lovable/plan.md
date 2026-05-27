## Scope

Four targeted fixes in `src/pages/ConciergeGuide.tsx`. Nothing else in the document is touched.

### 1. Yellow pill text actually centered

The pill currently uses `text-align:center` but the text still reads off-center because the pill is a plain inline `<span>` — the `padding` looks uneven against the uppercase/tracked text. Convert `.gold-badge` to a flex container with explicit centering and add letter-spacing tuned for the uppercase Montserrat:

```css
.gold-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.04em;
  padding: 7px 18px;   /* was 6px 16px — balances pill height */
  /* all other rules unchanged */
}
```

No other badge property changes. This fixes every page identically (Ally Cat, Fat Cat, ATV, Monkey Mountain, etc.).

### 2. Ally Cat hero shows the boat

Globally heroes use `background-position: center 40%`. Ally Cat's image has the catamaran in the lower-middle, so the global crop hides it. Add a one-off inline `background-position` override only on the Ally Cat hero div (line 199):

```html
<div class="hero-image" ... style="background-image:url('…ally-cat-hero-v5.jpg'); background-position:center 65%"></div>
```

No CSS or other hero changed.

### 3. Monkey Mountain hike — restore both photos

Current page 15 uses `<div class="image-frame">` wrappers (not present in CSS) instead of `.square-image-container`, so the right image collapses / mis-renders. Replace the row with the standard pattern used everywhere else:

```html
<div class="image-row">
  <div class="square-image-container">
    <img crossorigin="anonymous" src="…monkey-coastal-sunset.jpg" alt="Coastal Sunset" class="square-image" />
    <div class="caption">Coastal Sunset Views</div>
  </div>
  <div class="square-image-container">
    <img crossorigin="anonymous" src="…monkey-view-flowers.jpg" alt="Mountain View" class="square-image" />
    <div class="caption">Jungle Coast at Golden Hour</div>
  </div>
</div>
```

Same images, just wrapped in the working layout class.

### 4. ATV Adventure page — restore hero + add real info

Copy the uploaded photo `user-uploads://chulaatvhero.jpg` to `public/concierge-guide/atv-hero.jpg` so it loads locally (no Supabase round-trip needed). Then in the ATV page (lines 483-507):

- Insert a hero div right after the description, before the `image-row`:

```html
<div class="hero-image" role="img" aria-label="ATV Jungle River Crossing"
     data-bg-src="/concierge-guide/atv-hero.jpg"
     style="background-image:url('/concierge-guide/atv-hero.jpg'); background-position:center 60%"></div>
```

- Expand the description with researched MiChula Tours info (paraphrased, no marketing claims):

> "Tear through jungle trails, sandy beaches, river crossings and hidden mountain paths on a Honda 250cc quad. Tours depart Rancho Mi Chula three times daily (9 AM, 12 PM, 3 PM), led by bilingual local guides who know every trail. The route loops through dense Sierra Madre jungle, crosses shallow rivers and ends with a beach run — roughly 2 hours of riding plus stops."

- Expand the inclusions list to fill the empty lower half:

```
ATV Single: $119 USD
ATV Double: $147 USD
2-hour guided tour
Departures 9 AM · 12 PM · 3 PM
Driver min. 16 years (valid ID)
Max 7 quads per group
Helmet, goggles & bandana included
Bilingual guides
River crossings + jungle + beach
Bring closed shoes & change of clothes
Departs Rancho Mi Chula (~10 min)
Bottled water provided
```

- Add a `tip-box` after the list (matches other pages):

> "💡 **Concierge Tip:** Book the 9 AM departure — trails are quietest, the jungle is cool, and you're back at the villa in time for lunch. Bring sunglasses and clothes you don't mind getting muddy; the river crossings are part of the fun. Doubles work great for younger riders or anyone who'd rather hold on than drive."

### Why this won't disturb other pages

- The badge change is a 4-property CSS tweak in one block — every pill on every page gets the same visual lift (more centered, same size).
- The Ally Cat fix is one inline style on one element.
- Monkey Mountain swap reuses existing classes already used 10+ times.
- ATV page changes are localised; no shared CSS or page-height rules touched.

### Verification

1. Hard-reload `/concierge-guide`, scan console for `[ConciergeGuide] Page N overflows` warnings — only ATV page is at risk because we added content. If it overflows, trim the inclusions list to 10 items.
2. Click Download Guide; `pdftoppm` to JPEGs; verify pages 5 (Ally Cat boat visible), 13 (ATV hero + full content), 15 (two Monkey Mountain photos), and every page's pill text reads centered.

### Files changed

- `src/pages/ConciergeGuide.tsx` — only.
- `public/concierge-guide/atv-hero.jpg` — added (copy of uploaded image).  
  
  
keep our pricing in pesos for ATV mi chula, do not use online and usd pricing
- &nbsp;
- &nbsp;