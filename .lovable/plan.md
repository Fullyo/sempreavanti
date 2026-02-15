

## Fix In-App Browser Viewport Issues

When users open a shared link from Instagram, Facebook, or WhatsApp, those apps use an in-app browser that often has a visible address bar and navigation chrome. The classic CSS `vh` unit does not account for this -- it calculates based on the full screen height, causing content to overflow or get cut off behind the browser chrome.

### The Problem

The site currently uses `vh` units extensively:
- Layout wrapper: `min-h-screen` (which equals `100vh`)
- Homepage hero: `h-[90vh]`
- Subpage heroes: `h-[60vh]` and `h-[50vh]`

In an in-app browser, `100vh` is taller than the actual visible area, pushing content below the fold or behind the bottom navigation bar.

### The Solution

Replace `vh` with `dvh` (dynamic viewport height), which adjusts automatically when browser chrome appears or disappears. Include a `vh` fallback for older browsers.

### Changes

**1. src/index.css -- Add viewport-safe custom property**

Add a CSS custom property that uses `dvh` with a `vh` fallback:

```css
:root {
  --vh-safe: 1dvh;
}

@supports not (height: 1dvh) {
  :root {
    --vh-safe: 1vh;
  }
}
```

**2. src/components/layout/Layout.tsx -- Use dvh for min-height**

Change `min-h-screen` to `min-h-[100dvh]` with a fallback style:

```
from: className="min-h-screen flex flex-col"
to:   className="min-h-[100dvh] flex flex-col"
     + style={{ minHeight: '100dvh' }}
```

**3. src/components/home/HeroSection.tsx -- Hero height**

```
from: h-[90vh]
to:   h-[90dvh]
```

**4. All subpage hero sections -- Swap vh to dvh**

Update `h-[60vh]` and `h-[50vh]` across these files:
- `src/pages/Wellness.tsx` (60vh)
- `src/pages/Experiences.tsx` (60vh)
- `src/pages/Villas.tsx` (60vh)
- `src/pages/Contact.tsx` (50vh)
- `src/pages/experiences/Cultural.tsx` (60vh)
- `src/pages/experiences/Ocean.tsx` (60vh)
- Plus any other pages with the same pattern (Chef, Staff, Events, Weddings, Golf, Boats, Land, Surfing, Location, Transportation, Concierge, Pricing, PrivateEvents)

Each change is a simple class string swap: `h-[60vh]` becomes `h-[60dvh]`, `h-[50vh]` becomes `h-[50dvh]`.

**5. src/pages/NotFound.tsx -- min-h-screen swap**

```
from: min-h-screen
to:   min-h-[100dvh]
```

### What This Does NOT Change

- All `min-h-[...]` with pixel values stay as-is
- All responsive grid/flex layouts are untouched
- The `viewport` prop on framer-motion animations is unrelated and stays
- Desktop experience is identical (`dvh` equals `vh` when there is no dynamic browser chrome)

### Browser Support

`dvh` is supported in all modern browsers (Safari 15.4+, Chrome 108+, Firefox 101+). The `min-h-[600px]` and `min-h-[400px]` fallbacks already on every hero section ensure a safe minimum on any edge-case older browser.

