

## Fix SEO: Domain References, Meta Description, Sitemap & Favicon

### The Problems

1. **Wrong domain everywhere** -- All canonical URLs, sitemap entries, OG tags, structured data, and robots.txt reference `sempreavanti.lovable.app` instead of `villassempreavanti.com`. Google can't connect the sitemap to the actual domain it's crawling.

2. **Meta description still says "private beach"** -- Line 7 of `index.html` was missed in the previous wording audit. This is exactly what Google is displaying in the screenshot.

3. **JSON-LD structured data still says "private beach"** -- Line 37 of `index.html`.

4. **No proper favicon for Google** -- Google strongly prefers favicons that are multiples of 48px. The current `favicon.png` may not meet Google's requirements. We should also add an `apple-touch-icon` for better cross-platform support.

5. **"Fire Pit" still in amenities** -- Per project positioning memory, fire pit was removed from branding but remains in the JSON-LD structured data.

### Changes

**`index.html`** -- Update all domain references + fix wording:
- Line 7: Fix meta description -- replace "private beach" with "secluded beachfront"
- Line 9: Canonical URL → `https://villassempreavanti.com/`
- Line 15: OG URL → `https://villassempreavanti.com/`
- Line 16: OG image → `https://villassempreavanti.com/hero-villa.png`
- Line 21: Twitter image → `https://villassempreavanti.com/hero-villa.png`
- Line 37: JSON-LD description -- replace "private beach" with "secluded beachfront"
- Line 38: JSON-LD url → `https://villassempreavanti.com`
- Line 39: JSON-LD image → `https://villassempreavanti.com/hero-villa.png`
- Line 57: Remove "Fire Pit" amenity from JSON-LD
- Add `<link rel="apple-touch-icon" href="/favicon.png" />` for mobile bookmarks

**`public/sitemap.xml`** -- Replace all 19 `sempreavanti.lovable.app` URLs with `villassempreavanti.com`

**`public/robots.txt`** -- Update sitemap reference to `https://villassempreavanti.com/sitemap.xml`

**`sitemap.xml`** -- Also add `<lastmod>` dates (today's date) to help Google understand freshness

### Why Google Looks Bad Right Now

Google is crawling `villassempreavanti.com` but:
- The canonical tag points to a different domain (`sempreavanti.lovable.app`) -- this confuses Google about which is the "real" site
- The sitemap URL in robots.txt points to the wrong domain, so Google never finds or trusts it
- The meta description was never updated with the "private beach" fix, so Google shows the old misleading text

### Files Changed
1. `index.html`
2. `public/sitemap.xml`
3. `public/robots.txt`

