

# Fix: Persistent Guesty Cache + "Book Now" Button

## Root Cause

The Guesty API allows only **3 token renewals per 24 hours**. Supabase edge functions frequently cold-start, which wipes the in-memory cache. Every cold start triggers a new token request, burning through the limit almost immediately. Once exhausted, every request returns 429 until the 24h window resets -- meaning **no photos ever load**.

## Solution: Database-Backed Cache

Instead of relying on volatile in-memory caching, persist both the access token and the listings response in a Supabase database table. This way, even after a cold start, the edge function reads from the database first and only calls Guesty when the cache is truly expired.

## Changes

### 1. Create `guesty_cache` database table

A simple key-value cache table:

| Column | Type | Purpose |
|--------|------|---------|
| `key` | text (PK) | Cache key (`access_token` or `listings_data`) |
| `value` | jsonb | The cached JSON response |
| `expires_at` | timestamptz | When this cache entry expires |
| `updated_at` | timestamptz | Last update time |

RLS: Public SELECT (edge function reads via anon key), no INSERT/UPDATE from client. The edge function will use the service role key (available by default) to write.

### 2. Update `guesty-listings` edge function

New logic flow:

```text
Request arrives
  |
  v
Check DB for cached listings (key = 'listings_data')
  |
  +--> If valid (not expired) --> Return cached data immediately
  |
  +--> If expired or missing:
         |
         Check DB for cached access token (key = 'access_token')
           |
           +--> If valid --> Use it
           +--> If expired --> Request new token from Guesty
                                |
                                +--> On success: Save token to DB (23h TTL)
                                +--> On 429: Return stale DB listings if available
         |
         Fetch listings from Guesty API
           |
           +--> On success: Save to DB (2h TTL), return fresh data
           +--> On failure: Return stale DB listings if available, else return fallback
```

Key improvements:
- Token persists in DB with ~23h TTL (survives cold starts)
- Listings persist in DB with 2h TTL
- Even stale data is returned rather than showing nothing
- Fallback hardcoded data is the absolute last resort

### 3. Add "Check Availability" button to navbar

Add a prominent CTA button in the header linking to the Guesty booking engine:
- URL: `https://casasempreavanti.guestybookings.com/en/properties?minOccupancy=1`
- Opens in a new tab
- Styled as accent button, visible on both desktop and mobile
- Positioned at the far right of the nav bar

### 4. Update `useGuestyListings` hook

No major changes needed -- the hook already falls back to `fallbackListings`. The DB cache in the edge function will handle persistence transparently.

## Files to Change

| File | Change |
|------|--------|
| *(DB migration)* | Create `guesty_cache` table with RLS |
| `supabase/functions/guesty-listings/index.ts` | Rewrite caching to use DB reads/writes with service role client |
| `src/components/layout/Navbar.tsx` | Add "Check Availability" CTA button linking to booking engine |

