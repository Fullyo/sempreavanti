import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GRATUITY_RATE = 0.05;
const FEE_RATE = 0.05;
const UTV_GAS_PER_RENTAL = 1000;
const DEFAULT_FX = 16;

function isUtvRental(name: string): boolean {
  const n = (name || "").toLowerCase();
  if (n.includes("gas")) return false;
  return n.includes("can-am") || n.includes("maverick") || n.includes("polaris") || n.includes("utv");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const token = String(body?.token ?? "").trim();
    if (!token || !/^[0-9a-f-]{36}$/i.test(token)) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(
        "guest, checkin, checkout, items, accommodation_fare, accommodation_currency, exchange_rate, payment_status, amount_paid, paid_at",
      )
      .eq("pay_token", token)
      .maybeSingle();

    if (error) throw error;
    if (!booking) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const items = Array.isArray(booking.items) ? booking.items : [];
    // Sanitized line items — guest sees names, qty, and line total only.
    const lineItems = items.map((i: any) => ({
      name: i.name,
      qty: Number(i.qty) || 1,
      guest_total: Number(i.guest_total) || 0,
    }));

    const fx = Number(booking.exchange_rate) || DEFAULT_FX;
    const upsellsSubtotal = lineItems.reduce((s: number, i: any) => s + i.guest_total, 0);
    const hasGasLine = items.some((i: any) => (i.name || "").toLowerCase().includes("gas"));
    const utvUnits = hasGasLine
      ? 0
      : items.filter((i: any) => isUtvRental(i.name)).reduce((s: number, i: any) => s + (Number(i.qty) || 0), 0);
    const utvGas = utvUnits * UTV_GAS_PER_RENTAL;
    const accommodationMXN =
      booking.accommodation_currency === "USD"
        ? Number(booking.accommodation_fare) * fx
        : Number(booking.accommodation_fare);

    return new Response(
      JSON.stringify({
        guest: booking.guest,
        checkin: booking.checkin,
        checkout: booking.checkout,
        accommodationMXN,
        accommodationCurrency: booking.accommodation_currency,
        accommodationFare: Number(booking.accommodation_fare),
        fx,
        lineItems,
        upsellsSubtotal,
        utvGas,
        gratuityRate: GRATUITY_RATE,
        feeRate: FEE_RATE,
        paymentStatus: booking.payment_status,
        amountPaid: booking.amount_paid,
        paidAt: booking.paid_at,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
