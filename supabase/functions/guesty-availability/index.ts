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

const LISTING_ID = "697bcfcf3f5e990014fbc4dd";

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
  const response = await fetch("https://booking.guesty.com/oauth2/token", {
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
      return (cached.value as { token: string }).token;
    }
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  const data = await response.json();
  const ttl = Math.min(data.expires_in - 300, 23 * 3600);
  await setCache(supabase, "access_token", { token: data.access_token }, ttl);
  return data.access_token;
}

async function fetchCalendar(token: string, from: string, to: string) {
  const url = `https://booking.guesty.com/api/listings/${LISTING_ID}/calendar?from=${from}&to=${to}`;
  console.log(`Fetching calendar: ${url}`);
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Calendar API error ${response.status}:`, body.substring(0, 500));
    throw new Error(`Calendar API returned ${response.status}`);
  }

  return await response.json();
}

async function fetchQuote(token: string, checkIn: string, checkOut: string, guests: number) {
  const url = "https://booking.guesty.com/api/reservations/quotes";
  console.log(`Fetching quote: ${checkIn} to ${checkOut}, ${guests} guests`);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listingId: LISTING_ID,
      checkInDateLocalized: checkIn,
      checkOutDateLocalized: checkOut,
      guestsCount: guests,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Quote API error ${response.status}:`, body.substring(0, 500));
    return { error: true, status: response.status, message: body };
  }

  return await response.json();
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseAdmin();
    const token = await getAccessToken(supabase);

    const { action, from, to, checkIn, checkOut, guests } = await req.json();

    if (action === "calendar") {
      if (!from || !to) {
        return new Response(JSON.stringify({ error: "from and to dates required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Cache calendar for 15 minutes
      const cacheKey = `calendar_${from}_${to}`;
      const cached = await getFromCache(supabase, cacheKey);
      if (cached && new Date(cached.expires_at) > new Date()) {
        return new Response(JSON.stringify(cached.value), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await fetchCalendar(token, from, to);
      await setCache(supabase, cacheKey, data, 15 * 60);

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "quote") {
      if (!checkIn || !checkOut || !guests) {
        return new Response(JSON.stringify({ error: "checkIn, checkOut, and guests required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await fetchQuote(token, checkIn, checkOut, guests);
      
      if (data?.error) {
        console.error("Quote error details:", data.message);
        return new Response(JSON.stringify({ error: "Unable to get pricing for the selected dates. Please try different dates or contact us directly." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action. Use 'calendar' or 'quote'" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "We're experiencing technical difficulties. Please try again later." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
