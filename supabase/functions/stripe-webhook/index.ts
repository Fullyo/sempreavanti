import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17.7.0";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-12-18.acacia" });
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
  const signature = req.headers.get("stripe-signature");

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (e) {
    console.error("Webhook signature verification failed:", e?.message ?? e);
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const token = session.metadata?.pay_token;
      const bookingId = session.metadata?.booking_id;

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );

      const update = {
        payment_status: "paid",
        amount_paid: session.amount_total != null ? session.amount_total / 100 : null,
        guest_gratuity: session.metadata?.gratuity ? Number(session.metadata.gratuity) : null,
        guest_tip: session.metadata?.tip ? Number(session.metadata.tip) : null,
        paid_at: new Date().toISOString(),
        stripe_session_id: session.id,
      };

      if (bookingId) {
        await supabase.from("bookings").update(update).eq("id", Number(bookingId));
      } else if (token) {
        await supabase.from("bookings").update(update).eq("pay_token", token);
      }
      console.log("Marked booking paid:", bookingId ?? token);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook handler error:", e?.message ?? e);
    return new Response(JSON.stringify({ error: "Handler error" }), { status: 500 });
  }
});
