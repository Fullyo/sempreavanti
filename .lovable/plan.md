

# Fix: Clear Stale Error and Ensure Photos Load

## Root Cause Analysis

The Guesty API is **fully functional right now**. A direct call returns HTTP 200 with 3 listings and dozens of real property photos (pool, bedrooms, ocean views, balconies, etc.). Your API credentials are valid -- no new key is needed.

The error you see ("No listing data available from any source") is from a **stale cached response** from before the fix was deployed. The timeline:

- **01:42** -- Old code ran, failed (DNS error on wrong domain + missing auth token)
- **01:44** -- New code deployed, **successfully fetched 3 listings with photos**, cached them to DB
- **01:44+** -- All subsequent calls return cached data successfully

The preview is still showing the old error because React Query cached the failed response.

## What Needs to Happen

There is no code bug to fix. The edge function, the hook, and the components are all correctly wired. However, to be safe and ensure a clean state, I will:

### 1. Force a fresh fetch on page load

**File:** `src/hooks/useGuestyListings.ts`

- Reduce `staleTime` from 10 minutes to 2 minutes so stale errors don't persist as long
- Add `refetchOnMount: "always"` to ensure every page navigation triggers a fresh check
- This guarantees the working API response replaces any cached error

### 2. Add error recovery logging

**File:** `src/hooks/useGuestyListings.ts`

- Add a `console.log` when real API data is successfully received, showing how many listings and photos were loaded
- This helps confirm visually in the console that photos are being returned

## Files to Change

| File | Changes |
|------|---------|
| `src/hooks/useGuestyListings.ts` | Reduce staleTime, add refetchOnMount: "always" for error recovery |

This is a minimal change -- the real fix (the edge function) is already deployed and working.

