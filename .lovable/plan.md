

# Three Updates: Team Page CTA, Chef Page Photo, and Global Rebrand

## 1. Team Page -- Fix Cut-Off Bottom Section

The Team page (`/staff`) currently has a minimal bottom navigation section without a proper CTA. Other pages like Wellness and Weddings have a full CTA with a photo background, overlay, inquiry button, and page navigation arrows.

**Fix:** Replace the current sparse bottom nav section (lines 104-111 of `Staff.tsx`) with a full CTA section matching the pattern used on other pages -- property photo background with dark gradient overlay, an "Inquire" button via InquiryDialog, and PageNavArrows.

---

## 2. Chef Page -- Replace Solo Ricardo Photo with Two Chefs Photo

On the Chef page (`/chef`), the "Your Chefs" section (line 108) currently shows only `ricardoImg` (a single photo of Ricardo). Since we now have Crethell's photo from the staff uploads, we can use it here. However, the user specifically asked for a "Two Chefs" photo.

**Clarification needed:** The user uploaded individual photos for Ricardo and Crethell on the Team page. For the Chef page, the user mentioned replacing a "random photo" with a photo of "Two Chefs" together. The uploaded `Crethell.jpeg` was already used for the staff page. I'll use `staff-crethell.jpeg` (the Crethell photo) to create a two-photo grid replacing the single Ricardo image, showing both chefs side by side -- unless the user has a specific "two chefs together" photo they'd like to upload.

**Plan:** Replace the single `ricardoImg` photo in the "Ricardo and Crethell" section with a side-by-side layout of both `ricardoImg` and `crethellImg`.

---

## 3. Global Rebrand: "Villas Sempre Avanti" / "Villa Pietro" / "Villa Luisa"

The naming changes:
- "Casa Sempre Avanti" becomes **"Villas Sempre Avanti"**
- "Casa Pietro" becomes **"Villa Pietro"**
- "Casa Luisa" (already "Villa Luisa" in some places) stays **"Villa Luisa"**
- The short brand name "Sempre Avanti" in headers/footers stays as-is (it's the brand, not the property type prefix)

### Files requiring changes:

| File | What changes |
|------|-------------|
| `index.html` | Title, meta tags, og tags, twitter tags, JSON-LD schema: all "Casa Sempre Avanti" to "Villas Sempre Avanti" |
| `src/components/layout/Navbar.tsx` | Logo text stays "Sempre Avanti" (no change needed -- it's the brand) |
| `src/components/layout/Footer.tsx` | Brand name stays "Sempre Avanti"; tagline line 11: "Casa Sempre Avanti" to "Villas Sempre Avanti" |
| `src/pages/Index.tsx` | Line 117: "Casa Sempre Avanti" to "Villas Sempre Avanti"; "Casa Pietro and Casa Luisa" to "Villa Pietro and Villa Luisa" |
| `src/pages/Villas.tsx` | Lines 39-41: "Casa Pietro" to "Villa Pietro" in CURATED_DESCRIPTIONS; Lines 53-55: caption/finder references; Line 110: "Casa Pietro + Villa Luisa" to "Villa Pietro + Villa Luisa"; Line 111: heading text |
| `src/pages/Chef.tsx` | Line 105: "Sempre Avanti dining" -- no "Casa" prefix, stays as-is |
| `src/pages/Wellness.tsx` | Line 61: "At Sempre Avanti" -- stays as-is (no Casa prefix) |
| `src/pages/Weddings.tsx` | Line 45/76/127: "Sempre Avanti" references -- stays as-is (no Casa prefix) |
| `src/pages/PrivateEvents.tsx` | Lines 53/115: "Sempre Avanti" -- stays as-is |
| `src/pages/Location.tsx` | Line 189: "Sempre Avanti sits" stays; Line 213: map title "Casa Sempre Avanti" to "Villas Sempre Avanti"; Line 252: "Sempre Avanti team" stays |
| `src/pages/Contact.tsx` | Line 50: PhotoPlaceholder label "Casa Sempre Avanti" to "Villas Sempre Avanti" |
| `src/pages/Staff.tsx` | Line 92: "The Sempre Avanti Standard" -- stays as-is |
| `src/components/home/HeroSection.tsx` | Line 17: alt text "Casa Sempre Avanti" to "Villas Sempre Avanti"; Line 39: hero title stays "Sempre Avanti" |
| `src/components/home/CulinaryPreview.tsx` | Line 20: alt text "Casa Sempre Avanti" to "Villas Sempre Avanti" |
| `src/components/home/HospitalitySection.tsx` | Line 56: alt text "Sempre Avanti hospitality" -- stays |
| `src/components/home/PhotoMosaicSection.tsx` | Line 46: alt text "Casa Sempre Avanti" to "Villas Sempre Avanti" |
| `src/components/home/GuestReviews.tsx` | Lines 12/18: review quotes mention "Sempre Avanti" (no Casa) -- stays |
| `src/components/home/QuoteSection.tsx` | Line 20: "Sempre Avanti -- Always Forward" -- stays |
| `src/components/home/LocationPreview.tsx` | Line 39: "Sempre Avanti sits" -- stays (no Casa) |
| `src/pages/Transportation.tsx` | Line 69: "Sempre Avanti experience" -- stays |
| `src/hooks/useGuestyListings.ts` | Lines 40-41: "Casa Pietro" to "Villa Pietro"; Lines 43-45: descriptions with "Casa Sempre Avanti" to "Villas Sempre Avanti"; Lines 57-62: "Villa Luisa" stays; descriptions "Casa Sempre Avanti" to "Villas Sempre Avanti"; Lines 74-79: "Casa Sempre Avanti" to "Villas Sempre Avanti" |

---

## Technical Details

### Staff.tsx -- New CTA section (replacing lines 104-111)
- Add `import InquiryDialog` 
- Replace the bottom nav with a full CTA matching Wellness page pattern: photo background + dark gradient + inquiry button + PageNavArrows

### Chef.tsx -- Two-chefs layout (replacing line 108)
- Add `import crethellImg from "@/assets/staff-crethell.jpeg"`
- Replace single photo with a two-photo side-by-side grid showing both Ricardo and Crethell

### Global rebrand -- ~15 files
- Every instance of "Casa Sempre Avanti" becomes "Villas Sempre Avanti"
- Every instance of "Casa Pietro" becomes "Villa Pietro"  
- "Villa Luisa" remains unchanged
- The standalone brand "Sempre Avanti" (without "Casa" prefix) remains unchanged
- Navbar and Footer brand logos remain "Sempre Avanti"

