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

async function getOpenApiToken(supabase: ReturnType<typeof createClient>): Promise<string> {
  // Check cache
  const { data: cached } = await supabase
    .from("guesty_cache")
    .select("value, expires_at")
    .eq("key", "open_api_access_token")
    .maybeSingle();

  if (cached && new Date(cached.expires_at) > new Date()) {
    return (cached.value as { token: string }).token;
  }

  const clientId = Deno.env.get("GUESTY_OPEN_API_CLIENT_ID");
  const clientSecret = Deno.env.get("GUESTY_OPEN_API_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("Open API credentials not configured");

  const response = await fetch("https://open-api.guesty.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "open-api",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Open API token request failed:", response.status, errorBody);
    throw new Error(`Failed to get Open API token: ${response.status}`);
  }

  const data = await response.json();
  const ttl = Math.min(data.expires_in - 300, 23 * 3600);
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();

  await supabase
    .from("guesty_cache")
    .upsert(
      { key: "open_api_access_token", value: { token: data.access_token }, expires_at: expiresAt, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = getSupabaseAdmin();

    // Step 1: Save to database FIRST (guaranteed)
    const { data: inquiry, error: dbError } = await supabase
      .from("inquiries")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        preferred_dates: dates || null,
        group_size: groupSize || null,
        message: message || null,
        selected_activities: selectedActivities?.length ? selectedActivities : null,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Database insert failed:", dbError);
      return new Response(JSON.stringify({ error: "Failed to save inquiry" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Inquiry saved to database:", inquiry.id);

    // Step 2: Push to Guesty via Open API (best effort)
    let guestyReservationId: string | null = null;
    try {
      const token = await getOpenApiToken(supabase);

      const noteParts: string[] = [];
      if (dates) noteParts.push(`Preferred Dates: ${dates}`);
      if (groupSize) noteParts.push(`Group Size: ${groupSize}`);
      if (selectedActivities?.length) noteParts.push(`Activities: ${selectedActivities.join(", ")}`);
      if (message) noteParts.push(`Message: ${message}`);

      const guestyResponse = await fetch("https://open-api.guesty.com/v1/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: LISTING_ID,
          status: "inquiry",
          guest: {
            firstName,
            lastName,
            email,
            phone: phone || undefined,
          },
          note: noteParts.join("\n") || undefined,
        }),
      });

      if (guestyResponse.ok) {
        const guestyData = await guestyResponse.json();
        guestyReservationId = guestyData._id || guestyData.id || null;
        console.log("Guesty inquiry created:", guestyReservationId);

        if (guestyReservationId) {
          await supabase
            .from("inquiries")
            .update({ guesty_reservation_id: guestyReservationId })
            .eq("id", inquiry.id);
        }
      } else {
        const errText = await guestyResponse.text();
        console.error(`Guesty Open API failed (${guestyResponse.status}):`, errText.substring(0, 500));
      }
    } catch (guestyErr) {
      console.error("Guesty attempt failed (non-critical):", guestyErr);
    }

    return new Response(JSON.stringify({ success: true, inquiryId: inquiry.id, guestyReservationId }), {
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
