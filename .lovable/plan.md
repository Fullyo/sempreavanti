

## Plan: Logo Replacement + Navbar Fix on /guide

### 1. Add logo assets to the project

Copy both uploaded logo images into `src/assets/`:
- `src/assets/logo-white.png` (for transparent navbar state + dark footer)
- `src/assets/logo-black.png` (for scrolled/solid navbar state)

### 2. Update Navbar (`src/components/layout/Navbar.tsx`)

**Logo swap:** Replace the text `<Link>` ("Villas Sempre Avanti") with an `<img>` tag. Use the white logo when `!scrolled` and the black logo when `scrolled`. Size it for impact — roughly `h-10 md:h-12` (tall enough to be prominent within the 64-80px header).

**Fix /guide visibility:** Add `/guide` to the `forceScrolled` logic alongside `/book`. This forces the solid white navbar on pages that don't have a dark hero image behind the header, making all menu items immediately readable.

```
const forceScrolled = location.pathname === "/book" || location.pathname === "/guide";
```

### 3. Update Footer (`src/components/layout/Footer.tsx`)

Replace the text `<h3>Villas Sempre Avanti</h3>` with the white logo image. Size it large for visual impact — roughly `h-14 md:h-16` — centered, maintaining the existing `text-center mb-12` wrapper structure.

### 4. Update mobile menu brand (Navbar)

The mobile menu doesn't show the brand name separately, so no changes needed there. The top-left logo already handles it.

---

**Summary of changes:** 3 files touched (2 logo copies + Navbar.tsx + Footer.tsx). No structural or routing changes.

