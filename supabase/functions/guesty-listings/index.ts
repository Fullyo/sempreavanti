import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
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

async function fetchViaBookingEngine(): Promise<unknown | null> {
  try {
    console.log("Trying Booking Engine public API...");
    const response = await fetch(
      "https://booking.guesty.com/api/listings?listingId=697bcfcf3f5e990014fbc4dd",
      { headers: { Accept: "application/json" } }
    );
    if (!response.ok) {
      console.log("Booking Engine API returned:", response.status);
      return null;
    }
    const data = await response.json();
    console.log(`Booking Engine returned ${data?.results?.length || data?.length || 0} listings`);
    // Normalize to { results: [...] } format
    if (Array.isArray(data)) return { results: data };
    if (data?.results) return data;
    return { results: [data] };
  } catch (err) {
    console.error("Booking Engine API error:", err);
    return null;
  }
}

serve(async (req) => {
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

    // Layer 3: Try Open API
    let listingsData: unknown | null = null;

    try {
      const token = await getAccessToken(supabase);
      const listingsResponse = await fetchWithRetry(
        "https://booking-api.guesty.com/v1/listings?limit=25",
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (listingsResponse.ok) {
        listingsData = await listingsResponse.json();
        console.log(`Fetched ${(listingsData as any)?.results?.length || 0} fresh listings from Open API`);
      } else {
        console.error("Open API listings fetch failed:", listingsResponse.status);
      }
    } catch (err) {
      console.error("Open API failed:", err);
    }

    // Layer 4: Booking Engine fallback
    if (!listingsData) {
      listingsData = await fetchViaBookingEngine();
    }

    // If we got fresh data, cache it
    if (listingsData) {
      await setCache(supabase, "listings_data", listingsData, 2 * 3600);
      memCache = { listings: listingsData, expiresAt: Date.now() + 30 * 60 * 1000 };
      return new Response(JSON.stringify(listingsData), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=1800" },
      });
    }

    // Layer 5: Return stale DB data
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
