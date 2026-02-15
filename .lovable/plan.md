

# Fix: Villa Name Display and Header/Footer Branding

## Issues Found

### 1. "Casa Pietro" still showing on Villas page
The villa name displayed on the page comes directly from the Guesty API response (`villa.nickname`), which returns "Casa Pietro". The fallback data was updated, but when the live API responds, it overrides with the old name.

**Fix:** Add a name-mapping function in `src/pages/Villas.tsx` that normalizes API nicknames before display:

```text
"Casa Pietro" -> "Villa Pietro"
"Casa Luisa"  -> "Villa Luisa"
```

This will be applied on line 136 where `displayName` is set, so no matter what the API returns, the correct name is shown.

### 2. Header brand name needs updating
The Navbar (`src/components/layout/Navbar.tsx`, line 159) currently shows "Sempre Avanti". Update to "Villas Sempre Avanti".

### 3. Footer brand name needs updating  
The Footer (`src/components/layout/Footer.tsx`, line 9) currently shows "Sempre Avanti". Update to "Villas Sempre Avanti".

### 4. Footer copyright line
Line 62 of Footer says "Villas Sempre Avanti" -- this one is already correct.

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/Villas.tsx` | Add nickname normalization map so "Casa Pietro" from API displays as "Villa Pietro" |
| `src/components/layout/Navbar.tsx` | Line 159: "Sempre Avanti" to "Villas Sempre Avanti" |
| `src/components/layout/Footer.tsx` | Line 9: "Sempre Avanti" to "Villas Sempre Avanti" |
