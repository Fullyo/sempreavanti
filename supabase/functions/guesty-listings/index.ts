import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ALLOWED_ORIGINS = [
  "https://villassempreavanti.com",
  "https://sempreavanti.lovable.app",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

let memCache: { listings: unknown; expiresAt: number } | null = null;

function getSupabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

async function getFromCache(supabase: ReturnType<typeof createClient>, key: string) {
  const { data, error } = await supabase
    .from("guesty_cache")
    .select("value, expires_at")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    console.error(`Cache read error for ${key}:`, error.message);
    return null;
  }
  return data;
}

async function setCache(supabase: ReturnType<typeof createClient>, key: string, value: unknown, ttlSeconds: number) {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const { error } = await supabase
    .from("guesty_cache")
    .upsert({ key, value, expires_at: expiresAt, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) console.error(`Cache write error for ${key}:`, error.message);
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url, options);
    if (response.status === 429 && attempt < retries - 1) {
      const delay = Math.pow(2, attempt + 1) * 1000;
      console.log(`Rate limited. Retry in ${delay}ms (${attempt + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }
    return response;
  }
  throw new Error("Max retries exceeded");
}

async function getAccessToken(supabase: ReturnType<typeof createClient>): Promise<string> {
  const cached = await getFromCache(supabase, "access_token");
  if (cached && new Date(cached.expires_at) > new Date()) {
    console.log("Using DB-cached access token");
    return (cached.value as { token: string }).token;
  }

  const clientId = Deno.env.get("GUESTY_CLIENT_ID");
  const clientSecret = Deno.env.get("GUESTY_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("Guesty API credentials not configured");

  console.log("Fetching new Guesty access token...");
  const response = await fetchWithRetry("https://booking.guesty.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "booking_engine:api",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Token request failed:", response.status, errorBody);
    if (response.status === 429 && cached) {
      console.log("Rate limited on token refresh, using stale DB token");
      return (cached.value as { token: string }).token;
    }
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  const data = await response.json();
  const ttl = Math.min(data.expires_in - 300, 23 * 3600);
  await setCache(supabase, "access_token", { token: data.access_token }, ttl);
  console.log("Access token cached to DB");
  return data.access_token;
}

// Try multiple Booking Engine API endpoint variations
async function fetchListingsFromBookingEngine(token: string): Promise<unknown | null> {
  const endpoints = [
    // Try without filter first to get all listings
    "https://booking.guesty.com/api/listings",
    // Try with listing ID filter
    "https://booking.guesty.com/api/listings?listingId=697bcfcf3f5e990014fbc4dd",
  ];

  for (const url of endpoints) {
    try {
      console.log(`Trying BE-API: ${url}`);
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "no body");
        console.log(`BE-API ${url} returned ${response.status}: ${errorBody.substring(0, 300)}`);
        continue;
      }

      const data = await response.json();
      const count = data?.results?.length || (Array.isArray(data) ? data.length : 1);
      console.log(`BE-API success! Got ${count} listings from ${url}`);

      if (Array.isArray(data)) return { results: data };
      if (data?.results) return data;
      return { results: [data] };
    } catch (err) {
      console.error(`BE-API error for ${url}:`, err);
    }
  }

  return null;
}

// Try Open API (needs different OAuth scope — may not work with booking_engine:api credentials)
async function fetchListingsFromOpenApi(token: string): Promise<unknown | null> {
  try {
    console.log("Trying Open API (open-api.guesty.com)...");
    const response = await fetch("https://open-api.guesty.com/v1/listings?limit=25", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "no body");
      console.log(`Open API returned ${response.status}: ${errorBody.substring(0, 300)}`);
      return null;
    }

    const data = await response.json();
    console.log(`Open API returned ${(data as any)?.results?.length || 0} listings`);
    return data;
  } catch (err) {
    console.error("Open API error:", err);
    return null;
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseAdmin();

    // Layer 1: In-memory cache
    if (memCache && Date.now() < memCache.expiresAt) {
      console.log("Returning in-memory cached listings");
      return new Response(JSON.stringify(memCache.listings), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=1800" },
      });
    }

    // Layer 2: DB cache
    const dbCached = await getFromCache(supabase, "listings_data");
    const dbListings = dbCached?.value;
    const dbFresh = dbCached && new Date(dbCached.expires_at) > new Date();

    if (dbFresh && dbListings) {
      console.log("Returning DB-cached listings");
      memCache = { listings: dbListings, expiresAt: Date.now() + 30 * 60 * 1000 };
      return new Response(JSON.stringify(dbListings), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=1800" },
      });
    }

    // Get token
    const token = await getAccessToken(supabase);
    let listingsData: unknown | null = null;

    // Layer 3: Booking Engine API (primary — token scope matches)
    listingsData = await fetchListingsFromBookingEngine(token);

    // Layer 4: Open API fallback (may fail if credentials are BE-only)
    if (!listingsData) {
      listingsData = await fetchListingsFromOpenApi(token);
    }

    // Cache and return fresh data
    if (listingsData) {
      await setCache(supabase, "listings_data", listingsData, 2 * 3600);
      memCache = { listings: listingsData, expiresAt: Date.now() + 30 * 60 * 1000 };
      return new Response(JSON.stringify(listingsData), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=1800" },
      });
    }

    // Layer 5: Stale DB cache
    if (dbListings) {
      console.log("Returning stale DB listings as last resort");
      return new Response(JSON.stringify(dbListings), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
      });
    }

    throw new Error("No listing data available from any source");
  } catch (error) {
    console.error("Error in guesty-listings function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
