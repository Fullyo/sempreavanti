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

async function tryGuestyInquiry(
  supabase: ReturnType<typeof createClient>,
  token: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string | undefined,
  notes: string
): Promise<string | null> {
  // Try multiple date windows to find availability
  const offsets = [30, 60, 90];

  for (const offset of offsets) {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + offset);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 7);
    const checkInStr = checkIn.toISOString().split("T")[0];
    const checkOutStr = checkOut.toISOString().split("T")[0];

    try {
      // Step 1: Create quote
      const quoteResponse = await fetch("https://booking.guesty.com/api/reservations/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: LISTING_ID,
          checkInDateLocalized: checkInStr,
          checkOutDateLocalized: checkOutStr,
          guestsCount: 1,
          guest: { firstName, lastName, email, phone: phone || undefined },
        }),
      });

      if (!quoteResponse.ok) {
        const errText = await quoteResponse.text();
        console.log(`Quote failed for ${checkInStr} (${quoteResponse.status}): ${errText.substring(0, 200)}`);
        continue; // Try next date window
      }

      const quoteData = await quoteResponse.json();
      const quoteId = quoteData._id || quoteData.id;
      if (!quoteId) {
        console.log("No quote ID returned, trying next window");
        continue;
      }

      // Step 2: Convert to inquiry
      const inquiryResponse = await fetch(`https://booking.guesty.com/api/reservations/quotes/${quoteId}/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!inquiryResponse.ok) {
        const errText = await inquiryResponse.text();
        console.error(`Inquiry conversion failed (${inquiryResponse.status}): ${errText.substring(0, 200)}`);
        continue;
      }

      const inquiryData = await inquiryResponse.json();
      const reservationId = inquiryData._id || inquiryData.id;
      console.log("Guesty inquiry created:", reservationId);

      // Step 3: Add notes
      if (notes && reservationId) {
        try {
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
          console.error("Failed to add notes (non-critical):", noteErr);
        }
      }

      return reservationId || null;
    } catch (err) {
      console.error(`Error trying date offset ${offset}:`, err);
      continue;
    }
  }

  console.log("All date windows failed — inquiry saved to DB only");
  return null;
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

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Basic email format check
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

    // Step 2: Try Guesty (best effort)
    let guestyReservationId: string | null = null;
    try {
      const token = await getAccessToken(supabase);

      const notesParts: string[] = [];
      if (dates) notesParts.push(`Preferred Dates: ${dates}`);
      if (groupSize) notesParts.push(`Group Size: ${groupSize}`);
      if (selectedActivities?.length) notesParts.push(`Activities: ${selectedActivities.join(", ")}`);
      if (message) notesParts.push(`Message: ${message}`);
      const notes = notesParts.join("\n");

      guestyReservationId = await tryGuestyInquiry(supabase, token, firstName, lastName, email, phone, notes);

      if (guestyReservationId) {
        await supabase
          .from("inquiries")
          .update({ guesty_reservation_id: guestyReservationId })
          .eq("id", inquiry.id);
        console.log("Updated DB row with Guesty reservation ID");
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
