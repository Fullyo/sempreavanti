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

async function getAccessToken(supabase: ReturnType<typeof createClient>): Promise<string> {
  const { data: cached } = await supabase
    .from("guesty_cache")
    .select("value, expires_at")
    .eq("key", "access_token")
    .maybeSingle();

  if (cached && new Date(cached.expires_at) > new Date()) {
    console.log("Using cached access token");
    return (cached.value as { token: string }).token;
  }

  const clientId = Deno.env.get("GUESTY_CLIENT_ID");
  const clientSecret = Deno.env.get("GUESTY_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("Guesty API credentials not configured");

  console.log("Fetching new access token with scope: booking_engine:api");
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
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();

  await supabase
    .from("guesty_cache")
    .upsert(
      { key: "access_token", value: { token: data.access_token }, expires_at: expiresAt, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  return data.access_token;
}

// Find the next available date window by scanning the calendar
async function findAvailableDates(token: string, minNights: number): Promise<{ checkIn: string; checkOut: string } | null> {
  // Scan in 3-month chunks, up to 12 months out
  const now = new Date();
  for (let monthOffset = 1; monthOffset <= 12; monthOffset += 3) {
    const from = new Date(now);
    from.setMonth(from.getMonth() + monthOffset);
    const to = new Date(from);
    to.setMonth(to.getMonth() + 3);

    const fromStr = from.toISOString().split("T")[0];
    const toStr = to.toISOString().split("T")[0];

    console.log(`Scanning calendar ${fromStr} to ${toStr} for available window...`);

    const response = await fetch(
      `https://booking.guesty.com/api/listings/${LISTING_ID}/calendar?from=${fromStr}&to=${toStr}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
    );

    if (!response.ok) {
      console.error(`Calendar fetch failed (${response.status})`);
      continue;
    }

    const days: Array<{ date: string; status: string; minNights?: number }> = await response.json();

    // Find first run of consecutive available days >= minNights
    let runStart = -1;
    let runLength = 0;

    for (let i = 0; i < days.length; i++) {
      if (days[i].status === "available") {
        if (runStart === -1) runStart = i;
        runLength++;
        if (runLength >= minNights) {
          const checkIn = days[runStart].date;
          const checkOut = days[runStart + minNights].date;
          console.log(`Found available window: ${checkIn} to ${checkOut}`);
          return { checkIn, checkOut };
        }
      } else {
        runStart = -1;
        runLength = 0;
      }
    }
  }

  console.error("No available date window found in next 12 months");
  return null;
}

function parseGuestCount(groupSize: string | undefined): number {
  if (!groupSize) return 2;
  const match = groupSize.match(/(\d+)/);
  return match ? Math.max(parseInt(match[1], 10), 1) : 2;
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

    // Step 2: Push to Guesty via two-step Quote Flow
    let guestyReservationId: string | null = null;
    try {
      const token = await getAccessToken(supabase);
      const guestsCount = parseGuestCount(groupSize);

      // Find available dates for the quote (placeholder dates)
      const availableDates = await findAvailableDates(token, 4);
      if (!availableDates) {
        throw new Error("No available dates found for quote creation");
      }

      console.log(`Creating quote: ${availableDates.checkIn} to ${availableDates.checkOut}, ${guestsCount} guests`);

      // Step 2a: Create a quote
      const quoteResponse = await fetch("https://booking.guesty.com/api/reservations/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: LISTING_ID,
          checkInDateLocalized: availableDates.checkIn,
          checkOutDateLocalized: availableDates.checkOut,
          guestsCount,
          guest: {
            firstName,
            lastName,
            email,
            phone: phone || undefined,
          },
        }),
      });

      if (!quoteResponse.ok) {
        const errText = await quoteResponse.text();
        console.error(`Quote creation failed (${quoteResponse.status}):`, errText.substring(0, 500));
        throw new Error(`Quote creation failed: ${quoteResponse.status}`);
      }

      const quoteData = await quoteResponse.json();
      const quoteId = quoteData._id;
      // Extract ratePlanId - log the rates structure to find correct path
      const ratePlanId = quoteData.rates?.ratePlans?.[0]?.ratePlan?._id || null;
      console.log("Quote created, quoteId:", quoteId, "ratePlanId:", ratePlanId);
      console.log("Quote created, quoteId:", quoteId, "ratePlanId:", ratePlanId);
      console.log("Quote response keys:", Object.keys(quoteData).join(", "));

      // Step 2b: Convert quote to inquiry
      const noteString = buildNoteString({ dates, groupSize, selectedActivities, message });
      console.log("Converting quote to inquiry with note:", noteString.substring(0, 200));

      const inquiryBody: Record<string, unknown> = {
        note: noteString,
        guest: {
          firstName,
          lastName,
          email,
          phone: phone || undefined,
        },
      };
      if (ratePlanId) {
        inquiryBody.ratePlanId = ratePlanId;
      }

      console.log("Inquiry request body keys:", Object.keys(inquiryBody).join(", "));

      const inquiryResponse = await fetch(
        `https://booking.guesty.com/api/reservations/quotes/${quoteId}/inquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(inquiryBody),
        }
      );

      if (!inquiryResponse.ok) {
        const errText = await inquiryResponse.text();
        console.error(`Inquiry conversion failed (${inquiryResponse.status}):`, errText.substring(0, 800));
        throw new Error(`Inquiry conversion failed: ${inquiryResponse.status}`);
      }

      const inquiryData = await inquiryResponse.json();
      guestyReservationId = inquiryData._id || null;
      console.log("SUCCESS - Guesty inquiry created:", guestyReservationId, "status:", inquiryData.status);

      if (guestyReservationId) {
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
