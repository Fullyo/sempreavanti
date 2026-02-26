

## Two Tasks

### 1. Remove the "Massage & Spa" Section from Wellness Page

Remove lines 113-135 of `src/pages/Wellness.tsx` -- the section with the 3 spa provider cards (Nirvanna, Bendita, Buddha Gallery). The "Massages at Home" section above it (lines 94-111) stays, as does the Sound Bath section below.

Also remove the now-unused imports and data: `nirvannaImg`, `benditaImg`, `buddhaImg`, and the `massageProviders` array.

**File**: `src/pages/Wellness.tsx`

---

### 2. "Private Beach" Wording Audit

The beach is public, not private. The estate has direct beachfront access on a secluded stretch, but the beach itself cannot be called "private." Here is every instance found and the proposed replacement:

**Suggested framing**: Instead of "private beach," use phrases like:
- **"secluded beachfront"** -- emphasizes the feel without the legal claim
- **"direct beach access"** -- factual
- **"250 feet of oceanfront"** -- specific and impressive
- **"beachfront setting"** -- neutral and elegant

#### File-by-file changes:

**`index.html`** (SEO meta tags + structured data)
- `"private beach, pool"` → `"direct beach access, pool"`
- `"Private Beach"` amenity → `"Beachfront Access"`
- `"private beach"` in descriptions → `"secluded beachfront"`

**`src/components/book/AmenitiesGrid.tsx`**
- `"Private Beach"` → `"Beachfront Access"`

**`src/components/home/FlowOfDaySection.tsx`**
- `"on your private beach"` → `"on your secluded beachfront"`

**`src/pages/PrivateEvents.tsx`**
- Venue space label `"Private Beach"` → `"Secluded Beachfront"`
- Venue space desc `"250 feet of secluded beachfront"` -- already good, no change
- Description text `"A private beach, fire pit"` → `"A secluded beachfront, fire pit"`

**`src/pages/Events.tsx`**
- `"on your own private beach"` → `"on your own secluded beachfront"`

**`src/pages/Weddings.tsx`**
- `"250-foot private beach"` → `"250-foot secluded beachfront"`

**`src/pages/Location.tsx`**
- `"you wake up on a private beach"` → `"you wake up on a secluded beach"`

**`src/hooks/useGuestyListings.ts`** (fallback data)
- Villa Pietro summary: `"250 feet of private beachfront"` → `"250 feet of secluded beachfront"`
- Villa Luisa title: `"Private Beach Poolside"` → `"Beachfront Poolside"`
- Villa Luisa summary: `"250 feet of private beach"` → `"250 feet of secluded beachfront"`
- Full Estate description (x2): `"private beach"` → `"secluded beachfront"`
- Full Estate amenities: `"Private Beach"` → `"Beachfront Access"`

**`src/components/book/PropertyDescription.tsx`**
- `"250 feet of private beachfront"` → `"250 feet of secluded beachfront"`
- `"private beachfront estate"` → `"secluded beachfront estate"`
- `"private beach access"` → `"direct beach access"`
- `"private beachfront access"` → `"direct beachfront access"`

**No changes needed** (already accurate wording):
- `src/components/home/HeroSection.tsx` -- says "Private Beachfront Destination" (refers to the estate being private, not the beach -- this is fine)
- `src/components/layout/Footer.tsx` -- says "private beachfront estate" (the estate is private -- fine)
- `src/components/home/LocationPreview.tsx` -- no "private beach" reference
- `src/pages/Weddings.tsx` intro -- says "private estate" (correct)

### Files Changed
1. `src/pages/Wellness.tsx` -- remove Massage & Spa section
2. `index.html` -- fix SEO meta
3. `src/components/book/AmenitiesGrid.tsx` -- fix amenity label
4. `src/components/home/FlowOfDaySection.tsx` -- fix description
5. `src/pages/PrivateEvents.tsx` -- fix venue space + description
6. `src/pages/Events.tsx` -- fix event description
7. `src/pages/Weddings.tsx` -- fix wedding feature desc
8. `src/pages/Location.tsx` -- fix narrative text
9. `src/hooks/useGuestyListings.ts` -- fix fallback data
10. `src/components/book/PropertyDescription.tsx` -- fix multiple instances

