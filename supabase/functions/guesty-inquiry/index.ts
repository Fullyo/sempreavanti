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
  const CACHE_KEY = "open_api_access_token";

  const { data: cached } = await supabase
    .from("guesty_cache")
    .select("value, expires_at")
    .eq("key", CACHE_KEY)
    .maybeSingle();

  if (cached && new Date(cached.expires_at) > new Date()) {
    console.log("Using cached Open API token");
    return (cached.value as { token: string }).token;
  }

  const clientId = Deno.env.get("GUESTY_OPEN_API_CLIENT_ID");
  const clientSecret = Deno.env.get("GUESTY_OPEN_API_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("Open API credentials not configured");

  console.log("Fetching new Open API access token");
  const params = new URLSearchParams();
  params.set("grant_type", "client_credentials");
  params.set("scope", "open-api");
  params.set("client_id", clientId);
  params.set("client_secret", clientSecret);

  const response = await fetch("https://open-api.guesty.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Open API token request failed:", response.status, errorBody);
    if (response.status === 429 && cached) {
      return (cached.value as { token: string }).token;
    }
    throw new Error(`Failed to get Open API token: ${response.status}`);
  }

  const data = await response.json();
  const ttl = Math.min(data.expires_in - 300, 23 * 3600);
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();

  await supabase
    .from("guesty_cache")
    .upsert(
      { key: CACHE_KEY, value: { token: data.access_token }, expires_at: expiresAt, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  return data.access_token;
}

function buildNoteString(fields: {
  dates?: string;
  groupSize?: string;
  selectedActivities?: string[];
  message?: string;
}): string {
  const parts: string[] = ["--- Website Inquiry ---"];
  if (fields.dates) parts.push(`Preferred Dates: ${fields.dates}`);
  if (fields.groupSize) parts.push(`Group Size: ${fields.groupSize}`);
  if (fields.selectedActivities?.length) {
    parts.push(`Activities: ${fields.selectedActivities.join(", ")}`);
  }
  if (fields.message) parts.push(`Message: ${fields.message}`);
  return parts.join("\n");
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

    // Step 2: Push to Guesty via Open API with status: "inquiry"
    let guestyReservationId: string | null = null;
    try {
      const token = await getOpenApiToken(supabase);
      const noteString = buildNoteString({ dates, groupSize, selectedActivities, message });

      console.log("Creating Guesty inquiry via Open API...");
      console.log("Note:", noteString.substring(0, 200));

      const guestyResponse = await fetch("https://open-api.guesty.com/v1/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: LISTING_ID,
          status: "inquiry",
          checkInDateLocalized: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
          checkOutDateLocalized: new Date(Date.now() + 372 * 86400000).toISOString().split("T")[0],
          guest: {
            firstName,
            lastName,
            email,
            phone: phone || undefined,
          },
        }),
      });

      if (!guestyResponse.ok) {
        const errText = await guestyResponse.text();
        console.error(`Guesty Open API failed (${guestyResponse.status}):`, errText.substring(0, 800));
        throw new Error(`Guesty API failed: ${guestyResponse.status}`);
      }

      const guestyData = await guestyResponse.json();
      guestyReservationId = guestyData._id || null;
      console.log("SUCCESS - Guesty inquiry created:", guestyReservationId, "status:", guestyData.status);

      // Attach form data to the reservation via reservations-v3 notes
      if (guestyReservationId) {
        try {
          const notesResponse = await fetch(
            `https://open-api.guesty.com/v1/reservations-v3/${guestyReservationId}/notes`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                notes: {
                  guestRemarks: noteString,
                  specialRequests: noteString,
                },
              }),
            }
          );

          if (!notesResponse.ok) {
            const errText = await notesResponse.text();
            console.error(`Notes update failed (${notesResponse.status}):`, errText.substring(0, 500));
          } else {
            console.log("Notes attached to reservation successfully");
          }
        } catch (noteErr) {
          console.error("Notes update failed:", noteErr);
        }

        await supabase
          .from("inquiries")
          .update({ guesty_reservation_id: guestyReservationId })
          .eq("id", inquiry.id);
      }
    } catch (guestyErr) {
      console.error("Guesty push failed (inquiry saved to database):", guestyErr);
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
