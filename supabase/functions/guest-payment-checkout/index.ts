import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import Stripe from "npm:stripe@17.7.0";

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
    const tipMode = body?.tipMode === "percent" ? "percent" : "amount";
    const tipValue = Math.max(0, Number(body?.tipValue) || 0);
    const tipCurrency = body?.tipCurrency === "USD" ? "USD" : "MXN";
    const origin = String(body?.origin ?? req.headers.get("origin") ?? "https://villassempreavanti.com");

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
      .select("id, guest, items, accommodation_fare, accommodation_currency, exchange_rate, payment_status, guest_tip, tip, gratuity_waived")
      .eq("pay_token", token)
      .maybeSingle();

    if (error) throw error;
    if (!booking) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (booking.payment_status === "paid") {
      return new Response(JSON.stringify({ error: "Already paid" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const items = Array.isArray(booking.items) ? booking.items : [];
    const fx = Number(booking.exchange_rate) || DEFAULT_FX;

    // Server-side recompute — never trust client amounts.
    const upsellLines = items
      .map((i: any) => ({ name: String(i.name || "Service"), guest_total: Math.round(Number(i.guest_total) || 0) }))
      .filter((i: any) => i.guest_total > 0);
    const upsellsSubtotal = upsellLines.reduce((s: number, i: any) => s + i.guest_total, 0);

    const hasGasLine = items.some((i: any) => (i.name || "").toLowerCase().includes("gas"));
    // One tank (one fuel charge) per UTV rental line — NOT per day/qty.
    const utvUnits = hasGasLine ? 0 : items.filter((i: any) => isUtvRental(i.name)).length;
    const utvGas = utvUnits * UTV_GAS_PER_RENTAL;

    const accommodationMXN =
      booking.accommodation_currency === "USD"
        ? Number(booking.accommodation_fare) * fx
        : Number(booking.accommodation_fare);

    const tipBase = accommodationMXN + upsellsSubtotal + utvGas;
    // Tip is entirely the guest's choice — no mandatory gratuity, no floor.
    const tip =
      tipMode === "percent"
        ? Math.round(tipBase * (tipValue / 100))
        : Math.round(tipCurrency === "USD" ? tipValue * fx : tipValue);
    const chargeable = upsellsSubtotal + utvGas + tip;
    // Card fee applies ONLY to the charged lines (upsells + fuel + tip). It
    // does NOT apply to the accommodation fare — paid via Guesty.
    const feeBase = chargeable;
    const fee = Math.round(feeBase * FEE_RATE);
    const total = chargeable + fee;

    if (total <= 0) {
      return new Response(JSON.stringify({ error: "Nothing to charge" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-12-18.acacia" });

    const cents = (mxn: number) => Math.round(mxn * 100);
    const line_items: any[] = [];
    upsellLines.forEach((i: any) =>
      line_items.push({
        price_data: { currency: "mxn", product_data: { name: i.name }, unit_amount: cents(i.guest_total) },
        quantity: 1,
      }),
    );
    if (utvGas > 0)
      line_items.push({
        price_data: { currency: "mxn", product_data: { name: "UTV Gas" }, unit_amount: cents(utvGas) },
        quantity: 1,
      });
    if (gratuity > 0)
      line_items.push({
        price_data: {
          currency: "mxn",
          product_data: { name: "Staff gratuity (5% included)" },
          unit_amount: cents(gratuity),
        },
        quantity: 1,
      });
    if (tip > 0)
      line_items.push({
        price_data: { currency: "mxn", product_data: { name: "Staff tip" }, unit_amount: cents(tip) },
        quantity: 1,
      });
    line_items.push({
      price_data: {
        currency: "mxn",
        product_data: { name: "Card processing fee (5%)" },
        unit_amount: cents(fee),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Our account settles in pesos — never let Stripe present USD (or any
      // other) currency to the guest at checkout.
      adaptive_pricing: { enabled: false },
      currency: "mxn",
      line_items,
      success_url: `${origin}/pay/${token}?status=success`,
      cancel_url: `${origin}/pay/${token}?status=cancel`,
      metadata: {
        booking_id: String(booking.id),
        pay_token: token,
        gratuity: String(gratuity),
        tip: String(tip),
        fee: String(fee),
        total: String(total),
      },
    });

    await supabase.from("bookings").update({ stripe_session_id: session.id }).eq("id", booking.id);

    return new Response(JSON.stringify({ url: session.url, total }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
