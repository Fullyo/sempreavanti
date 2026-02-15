

## Fix Remaining "10 Guests" and "Fire Pit" on Homepage

Two issues remain on the homepage (`src/pages/Index.tsx`):

### 1. Guest capacity: "10" should be "14"

Line 126 has a hardcoded stat `{ value: "10", label: "Guests" }`. This needs to change to `"14"`.

### 2. "Fire pit" in body copy

Line 120 reads:
> "Two adjacent beachfront villas with private pool, fire pit, beachfront dining, and a dedicated team..."

Remove "fire pit, " from this sentence so it reads:
> "Two adjacent beachfront villas with private pool, beachfront dining, and a dedicated team..."

### Files to modify
- `src/pages/Index.tsx` — two changes (lines 120 and 126)

### What stays the same
- "Fire pit" references on the Events, Weddings, and PrivateEvents pages remain — those describe the actual venue feature in context
- "Fire Pit" in amenity lists within fallback listing data remains — it's an accurate amenity
- All other pages already reflect the correct capacity from the API or fallback data (which was already updated to 14)

