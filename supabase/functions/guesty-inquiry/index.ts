import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ALLOWED_ORIGINS = [
  "https://villassempreavanti.com",
  "https://sempreavanti.lovable.app",
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return true;
  if (/^https:\/\/id-preview--[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

const LISTING_ID = "697bcfcf3f5e990014fbc4dd";
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_ACTIVITIES = [
  "Surfing",
  "Golf",
  "Boat Tours",
  "Fishing",
  "Private Chef",
  "Wellness & Yoga",
  "Cultural Tours",
  "Whale Watching",
  "Horseback Riding",
  "ATV Tours",
  "Scuba Diving",
  "Snorkeling",
  "Wedding",
  "Event",
];

function validateInquiry(body: unknown): { valid: true; data: ValidatedInquiry } | { valid: false; error: string } {
  if (!body || typeof body !== "object") return { valid: false, error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  const firstName = typeof b.firstName === "string" ? b.firstName.trim().slice(0, 100) : "";
  const lastName = typeof b.lastName === "string" ? b.lastName.trim().slice(0, 100) : "";
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase().slice(0, 255) : "";

  if (!firstName) return { valid: false, error: "First name is required" };
  if (!lastName) return { valid: false, error: "Last name is required" };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { valid: false, error: "A valid email address is required" };

  const phone = typeof b.phone === "string" ? b.phone.trim().slice(0, 30) : undefined;
  const checkIn = typeof b.checkIn === "string" && DATE_REGEX.test(b.checkIn) ? b.checkIn : undefined;
  const checkOut = typeof b.checkOut === "string" && DATE_REGEX.test(b.checkOut) ? b.checkOut : undefined;
  const groupSize = typeof b.groupSize === "string" ? b.groupSize.trim().slice(0, 50) : undefined;
  const message = typeof b.message === "string" ? b.message.trim().slice(0, 2000) : undefined;
  const inquiryType = typeof b.inquiryType === "string" ? b.inquiryType.trim().slice(0, 50) : undefined;
  const occasion = typeof b.occasion === "string" ? b.occasion.trim().slice(0, 100) : undefined;

  let selectedActivities: string[] | undefined;
  if (Array.isArray(b.selectedActivities)) {
    selectedActivities = b.selectedActivities
      .filter((a): a is string => typeof a === "string" && ALLOWED_ACTIVITIES.includes(a))
      .slice(0, 20);
    if (selectedActivities.length === 0) selectedActivities = undefined;
  }

  return { valid: true, data: { firstName, lastName, email, phone, checkIn, checkOut, groupSize, message, selectedActivities, inquiryType, occasion } };
}

interface ValidatedInquiry {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  checkIn?: string;
  checkOut?: string;
  groupSize?: string;
  message?: string;
  selectedActivities?: string[];
  inquiryType?: string;
  occasion?: string;
}

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
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
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
  const corsHeaders = getCorsHeaders(req);

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
    const validation = validateInquiry(body);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { firstName, lastName, email, phone, checkIn, checkOut, groupSize, message, selectedActivities } = validation.data;
    const supabase = getSupabaseAdmin();

    // Step 1: Save to database FIRST (guaranteed)
    const { data: inquiry, error: dbError } = await supabase
      .from("inquiries")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        preferred_dates: checkIn && checkOut ? `${checkIn} to ${checkOut}` : null,
        group_size: groupSize || null,
        message: message || null,
        selected_activities: selectedActivities?.length ? selectedActivities : null,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Database insert failed:", dbError);
      return new Response(JSON.stringify({ error: "We couldn't process your inquiry. Please try again later." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Inquiry saved to database:", inquiry.id);

    // Step 2: Push to Guesty via Open API with status: "inquiry"
    let guestyReservationId: string | null = null;
    try {
      const token = await getOpenApiToken(supabase);
      const datesDisplay = checkIn && checkOut ? `${checkIn} to ${checkOut}` : undefined;
      const noteString = buildNoteString({ dates: datesDisplay, groupSize, selectedActivities, message });

      console.log("Creating Guesty inquiry via Open API...");

      const guestyResponse = await fetch("https://open-api.guesty.com/v1/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: LISTING_ID,
          status: "inquiry",
          checkInDateLocalized: checkIn || new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
          checkOutDateLocalized: checkOut || new Date(Date.now() + 372 * 86400000).toISOString().split("T")[0],
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
      console.log("SUCCESS - Guesty inquiry created:", guestyReservationId);

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

    // Step 3: Send email notification to villa owner via Lovable Email
    try {
      const { error: emailErr } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "inquiry-notification",
          recipientEmail: "villassempreavanti@gmail.com",
          idempotencyKey: `inquiry-notify-${inquiry.id}`,
          templateData: {
            inquiryType: "Villa Stay",
            firstName,
            lastName,
            email,
            phone,
            checkIn,
            checkOut,
            groupSize,
            selectedActivities,
            message,
            source: "villassempreavanti.com",
          },
        },
      });
      if (emailErr) console.error("Email notification failed:", emailErr);
    } catch (emailErr) {
      console.error("Email notification threw:", emailErr);
    }

    return new Response(JSON.stringify({ success: true, inquiryId: inquiry.id, guestyReservationId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in guesty-inquiry:", error);
    return new Response(JSON.stringify({ error: "We couldn't process your inquiry. Please try again later." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
