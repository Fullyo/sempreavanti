import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    return (cached.value as { token: string }).token;
  }

  const clientId = Deno.env.get("GUESTY_CLIENT_ID");
  const clientSecret = Deno.env.get("GUESTY_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("Guesty API credentials not configured");

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
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  const data = await response.json();
  const ttl = Math.min(data.expires_in - 300, 23 * 3600);
  await setCache(supabase, "access_token", { token: data.access_token }, ttl);
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, dates, groupSize, message, selectedActivities } = body;

    if (!firstName || !lastName || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = getSupabaseAdmin();
    const token = await getAccessToken(supabase);

    // Build notes from all extra fields
    const notesParts: string[] = [];
    if (dates) notesParts.push(`Preferred Dates: ${dates}`);
    if (groupSize) notesParts.push(`Group Size: ${groupSize}`);
    if (selectedActivities?.length) notesParts.push(`Activities: ${selectedActivities.join(", ")}`);
    if (message) notesParts.push(`Message: ${message}`);
    const notes = notesParts.join("\n");

    // Try Booking Engine inquiry endpoint first
    const bePayload = {
      listingId: LISTING_ID,
      checkIn: "",
      checkOut: "",
      status: "inquiry",
      guest: {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
      },
      note: notes,
    };

    console.log("Submitting inquiry via Booking Engine API...");
    let response = await fetch("https://booking.guesty.com/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bePayload),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Inquiry submitted via BE API:", result);
      return new Response(JSON.stringify({ success: true, source: "booking_engine" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const beError = await response.text();
    console.log(`BE inquiry returned ${response.status}: ${beError.substring(0, 300)}`);

    // Fallback: Open API reservations endpoint
    const openApiPayload = {
      listingId: LISTING_ID,
      status: "inquiry",
      guest: {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
      },
      note: notes,
    };

    console.log("Falling back to Open API...");
    response = await fetch("https://open-api.guesty.com/v1/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(openApiPayload),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Inquiry submitted via Open API:", result);
      return new Response(JSON.stringify({ success: true, source: "open_api" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openError = await response.text();
    console.error(`Open API inquiry returned ${response.status}: ${openError.substring(0, 500)}`);

    return new Response(JSON.stringify({ error: "Failed to submit inquiry to Guesty", details: openError.substring(0, 200) }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in guesty-inquiry:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
