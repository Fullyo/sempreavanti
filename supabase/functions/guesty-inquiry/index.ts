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

    // Use placeholder dates 30 days from now (7-night stay) for the quote
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 30);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 7);
    const checkInStr = checkIn.toISOString().split("T")[0];
    const checkOutStr = checkOut.toISOString().split("T")[0];

    // Step 1: Create a reservation quote
    const quotePayload = {
      listingId: LISTING_ID,
      checkInDateLocalized: checkInStr,
      checkOutDateLocalized: checkOutStr,
      guestsCount: 1,
      guest: {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
      },
    };

    console.log("Step 1: Creating reservation quote...");
    const quoteResponse = await fetch("https://booking.guesty.com/api/reservations/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(quotePayload),
    });

    const quoteContentType = quoteResponse.headers.get("content-type") || "";
    if (!quoteResponse.ok) {
      const errorBody = quoteContentType.includes("application/json")
        ? JSON.stringify(await quoteResponse.json())
        : await quoteResponse.text();
      console.error(`Quote creation failed ${quoteResponse.status}: ${errorBody.substring(0, 500)}`);
      return new Response(JSON.stringify({ error: "Failed to create inquiry", details: errorBody.substring(0, 200) }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const quoteData = await quoteResponse.json();
    const quoteId = quoteData._id || quoteData.id;
    console.log("Quote created:", quoteId);

    if (!quoteId) {
      console.error("No quote ID in response:", JSON.stringify(quoteData).substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to create inquiry - no quote ID returned" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 2: Convert quote to inquiry
    console.log("Step 2: Converting quote to inquiry...");
    const inquiryResponse = await fetch(`https://booking.guesty.com/api/reservations/quotes/${quoteId}/inquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    const inquiryContentType = inquiryResponse.headers.get("content-type") || "";
    if (!inquiryResponse.ok) {
      const errorBody = inquiryContentType.includes("application/json")
        ? JSON.stringify(await inquiryResponse.json())
        : await inquiryResponse.text();
      console.error(`Inquiry creation failed ${inquiryResponse.status}: ${errorBody.substring(0, 500)}`);
      return new Response(JSON.stringify({ error: "Failed to finalize inquiry", details: errorBody.substring(0, 200) }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const inquiryData = await inquiryResponse.json();
    const reservationId = inquiryData._id || inquiryData.id;
    console.log("Inquiry created successfully:", reservationId);

    // Step 3: If we have notes, add them to the reservation
    if (notes && reservationId) {
      try {
        console.log("Adding notes to reservation...");
        // Use the update reservation endpoint to add notes
        await fetch(`https://booking.guesty.com/api/reservations/${reservationId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ note: notes }),
        });
      } catch (noteErr) {
        // Non-critical - the inquiry was already created
        console.error("Failed to add notes (non-critical):", noteErr);
      }
    }

    return new Response(JSON.stringify({ success: true, reservationId }), {
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
