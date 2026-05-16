## Goal

Move the `/concierge` password from a client-side env var (visible in JS bundle) to a server-side check via a Supabase edge function, so the password never ships to the browser.

## Approach

**1. Store password as a server-side secret**

- Add `CONCIERGE_PASSWORD` via the secrets tool (runtime secret, available only to edge functions).
- Remove dependency on `VITE_CONCIERGE_PASSWORD` (build-time, leaks into bundle).

**2. New edge function: `concierge-auth**`

- `supabase/functions/concierge-auth/index.ts`
- Accepts `{ password: string }` POST.
- Compares against `Deno.env.get("CONCIERGE_PASSWORD")` using constant-time comparison.
- On success: returns a signed session token (HMAC of `expiry|nonce` using a server secret) with ~12h expiry.
- On failure: returns 401 with a small artificial delay (basic brute-force friction).
- CORS enabled, `verify_jwt = false` in `supabase/config.toml`.

**3. New edge function: `concierge-verify**`

- Validates the session token from the client on page load / refresh.
- Returns `{ valid: true }` or 401.

**4. Update `src/pages/Concierge.tsx**`

- Replace direct `import.meta.env.VITE_CONCIERGE_PASSWORD` comparison with `supabase.functions.invoke('concierge-auth', { body: { password } })`.
- Store returned token in `sessionStorage` (key: `concierge_token`).
- On mount, if token exists, call `concierge-verify`; if invalid/expired, clear it and show password gate.
- Show loading state during auth check.

**5. Cleanup**

- Remove any reference to `VITE_CONCIERGE_PASSWORD` from the codebase.
- User can delete the build-time env var from project settings afterward (optional, harmless if left).

## Technical notes

- Token format: base64url(`expiry.nonce.hmac`) signed with a server-only secret (`CONCIERGE_SIGNING_KEY`, auto-generated and added as a secret).
- No new database tables — stateless tokens keep it simple.
- All existing concierge functionality (bookings, services, exports) stays unchanged; only the gate changes.

## Files

- new: `supabase/functions/concierge-auth/index.ts`
- new: `supabase/functions/concierge-verify/index.ts`
- edited: `src/pages/Concierge.tsx`
- secrets: add `CONCIERGE_PASSWORD`, `CONCIERGE_SIGNING_KEY`

## Question

What password should I set for `CONCIERGE_PASSWORD`? Keep `SempreAvanti2026`, or use a new one? (I'll prompt you via the secrets tool — you'll enter it in a secure form, I won't see it.) new one, send me the safe place to enter it

&nbsp;