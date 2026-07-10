import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { verifyConciergeToken } from "../_shared/concierge-token.ts";

// Pulls upcoming reservations from the Guesty Open API and upserts them into the
// `reservations` table. Each new reservation gets a `meal_token` (used for the
// guest meal-planner link). Callable manually with a valid concierge token, or
// by the scheduled cron using the service-role bearer.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const OPEN_API = "https://open-api.guesty.com";

// Only the three Villas Sempre Avanti listings (Pietro, Luisa, and the whole
// property "Sempre Avanti"). Other listings on the account are ignored.
const ALLOWED_LISTINGS = new Set([
  "697bcfb8c91d8d0015ca285a", // Villa Pietro
  "697bcfe3a874360012e8aa31", // Villa Luisa
  "697bcfcf3f5e990014fbc4dd", // Sempre Avanti (whole property)
]);

async function getOpenApiToken(supabase: ReturnType<typeof createClient>): Promise<string> {
  // Reuse a cached token when still valid.
  const { data: cached } = await supabase
    .from("guesty_cache")
    .select("value, expires_at")
    .eq("key", "open_api_token")
    .maybeSingle();
  if (cached && new Date(cached.expires_at as string) > new Date()) {
    return (cached.value as { token: string }).token;
  }

  const clientId = Deno.env.get("GUESTY_OPEN_API_CLIENT_ID");
  const clientSecret = Deno.env.get("GUESTY_OPEN_API_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("Missing Guesty Open API credentials");

  const res = await fetch(`${OPEN_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "open-api",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Open API token failed [${res.status}]: ${t}`);
  }
  const data = await res.json();
  const ttl = Math.max(60, (Number(data.expires_in) || 3600) - 120);
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  await supabase.from("guesty_cache").upsert(
    { key: "open_api_token", value: { token: data.access_token }, expires_at: expiresAt, updated_at: new Date().toISOString() },
    { onConflict: "key" },
  );
  return data.access_token as string;
}

function nightsBetween(checkin: string | null, checkout: string | null): number | null {
  if (!checkin || !checkout) return null;
  const a = new Date(checkin).getTime();
  const b = new Date(checkout).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.max(0, Math.round((b - a) / 86400000));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const signingKey = Deno.env.get("CONCIERGE_SIGNING_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const body = await req.json().catch(() => ({}));
    const token = typeof body?.token === "string" ? body.token : "";
    const authHeader = req.headers.get("Authorization") || "";
    const isCron = authHeader === `Bearer ${serviceKey}`;
    const isConcierge = signingKey ? await verifyConciergeToken(token, signingKey) : false;
    if (!isCron && !isConcierge) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);

    const accessToken = await getOpenApiToken(supabase);

    // Fetch reservations that end today or later (upcoming + in-house).
    const today = new Date().toISOString().slice(0, 10);
    const fields = "guest.fullName checkIn checkOut listingId status nightsCount listing.nickname listing.title money.fareAccommodation money.currency";
    let skip = 0;
    const limit = 100;
    let total = Infinity;
    let synced = 0;
    const rows: Record<string, unknown>[] = [];

    while (skip < total && skip < 1000) {
      const url = new URL(`${OPEN_API}/v1/reservations`);
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("skip", String(skip));
      // IMPORTANT: The Open API /v1/reservations list endpoint IGNORES loose
      // date query params like `checkOutDateFrom` and falls back to a default
      // view that only returns UPCOMING arrivals — silently dropping any stay
      // that is currently in-house (checked in but not yet checked out). The
      // documented `filters` JSON array is the only reliable way to date-scope
      // the list, and it correctly returns in-house + future reservations.
      url.searchParams.set(
        "filters",
        JSON.stringify([{ field: "checkOut", operator: "$gte", value: today }]),
      );
      url.searchParams.set("sort", "checkIn");
      url.searchParams.set("fields", fields);
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Reservations fetch failed [${res.status}]: ${t}`);
      }
      const data = await res.json();
      const results: any[] = data.results || data.data || [];
      total = Number(data.count ?? results.length + skip);
      for (const r of results) {
        const listingId = r.listingId ?? r.listing?._id ?? null;
        if (!listingId || !ALLOWED_LISTINGS.has(String(listingId))) continue;
        const checkin = r.checkIn ? String(r.checkIn).slice(0, 10) : null;
        const checkout = r.checkOut ? String(r.checkOut).slice(0, 10) : null;
        // Room-only accommodation fare (never the folio total).
        const fareAccom = Number(r.money?.fareAccommodation);
        rows.push({
          guesty_id: String(r._id || r.id),
          guest: r.guest?.fullName ?? null,
          checkin,
          checkout,
          nights: r.nightsCount ?? nightsBetween(checkin, checkout),
          listing_id: listingId,
          listing_name: r.listing?.nickname ?? r.listing?.title ?? null,
          status: r.status ?? null,
          fare_accommodation: Number.isFinite(fareAccom) ? fareAccom : null,
          raw: r,
        });
      }
      skip += limit;
      if (results.length < limit) break;
    }

    if (rows.length) {
      // Keep the raw reservations archive up to date (dormant, but harmless).
      const { error: resErr } = await supabase
        .from("reservations")
        .upsert(
          rows.map(({ fare_accommodation, ...rest }) => rest),
          { onConflict: "guesty_id", ignoreDuplicates: false },
        );
      if (resErr) throw resErr;

      // Bookings are the single source of truth. Only touch Guesty-owned fields
      // so concierge-entered upsells / tips / fare corrections are never clobbered.
      const guestyIds = rows.map((r) => r.guesty_id as string);
      const { data: existing, error: exErr } = await supabase
        .from("bookings")
        .select("guesty_id, accommodation_fare, guesty_fare")
        .in("guesty_id", guestyIds);
      if (exErr) throw exErr;
      const existingMap = new Map(
        (existing ?? []).map((b: any) => [b.guesty_id, b]),
      );

      const toInsert: Record<string, unknown>[] = [];
      for (const r of rows) {
        const gid = r.guesty_id as string;
        const guestyFare = r.fare_accommodation ?? 0;
        const stayFields: Record<string, unknown> = {
          guest: r.guest ?? "Guest",
          checkin: r.checkin,
          checkout: r.checkout ?? r.checkin,
          nights: r.nights,
          listing_name: r.listing_name,
          res_status: r.status,
        };
        const prev = existingMap.get(gid);
        if (prev) {
          // Always refresh the reference Guesty fare.
          stayFields.guesty_fare = guestyFare;
          // Only overwrite the effective fare when the concierge hasn't edited it.
          // "Not edited" = current fare still matches the last Guesty fare (or was
          // never populated, e.g. backfilled rows with fare 0 / null guesty_fare).
          const curFare = Number(prev.accommodation_fare) || 0;
          const prevGuesty = prev.guesty_fare;
          const untouched = prevGuesty == null || curFare === (Number(prevGuesty) || 0);
          if (untouched) {
            stayFields.accommodation_fare = guestyFare;
            stayFields.accommodation_currency = "usd";
          }
          const { error } = await supabase.from("bookings").update(stayFields).eq("guesty_id", gid);
          if (error) throw error;
        } else {
          toInsert.push({
            ...stayFields,
            guesty_id: gid,
            source: "guesty",
            accommodation_fare: guestyFare,
            guesty_fare: guestyFare,
            accommodation_currency: "usd",
          });
        }
      }
      if (toInsert.length) {
        const { error } = await supabase.from("bookings").insert(toInsert);
        if (error) throw error;
      }
      synced = rows.length;
    }

    return json({ ok: true, synced });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
