

## Fix: Photos Not Loading Across the Site

### Root Cause

There are **two problems**:

1. **CORS blocking preview/dev origins** -- The `guesty-listings` edge function only allows `villassempreavanti.com` and `sempreavanti.lovable.app`. The preview uses origins like `*.lovableproject.com` and `id-preview--*.lovable.app`, which get rejected. Every network request in the logs shows "Failed to fetch."

2. **No local fallback photos** -- When Guesty API fails, the fallback listings have `pictures: []`. Components that depend on Guesty photos (HospitalitySection, CTA section on homepage) show empty placeholders instead of real images.

### Changes

#### 1. Fix CORS in `guesty-listings` edge function

Add pattern matching for Lovable preview/dev origins so the function works during development:

**`supabase/functions/guesty-listings/index.ts`** -- Update `getCorsHeaders` to also accept origins matching `*.lovable.app` and `*.lovableproject.com` patterns, in addition to the two hardcoded production domains.

Also apply the same fix to `guesty-availability/index.ts` and `guesty-inquiry/index.ts` for consistency.

#### 2. Add local fallback image to HospitalitySection

**`src/components/home/HospitalitySection.tsx`** -- Import `staff-hero.jpeg` as fallback. Use Guesty photo if available, otherwise show the local image instead of the placeholder.

#### 3. Add local fallback image to Index CTA section

**`src/pages/Index.tsx`** (lines 185-196) -- Import a local estate image (e.g. `estate-1.jpeg` which is already imported) as fallback for the CTA background, instead of showing a plain gradient when Guesty is unavailable.

### Files Changed
1. `supabase/functions/guesty-listings/index.ts` -- CORS pattern matching
2. `supabase/functions/guesty-availability/index.ts` -- CORS pattern matching
3. `supabase/functions/guesty-inquiry/index.ts` -- CORS pattern matching
4. `src/components/home/HospitalitySection.tsx` -- local fallback image
5. `src/pages/Index.tsx` -- local fallback image for CTA

