import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { verifyConciergeToken } from "../_shared/concierge-token.ts";

// Secured data gateway for the concierge tool. Every operation requires a valid
// concierge session token. All DB access happens here with the service role, so
// the underlying tables (services / bookings / petty_cash) can deny anon access.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Column allow-lists prevent writes to unexpected fields.
const SERVICE_COLS = ["category", "name", "type", "price", "unit_cost", "sub_text", "is_active", "sort_order"];
const BOOKING_COLS = [
  "guest", "checkin", "checkout", "items", "cc_fee_on", "tip_mode", "tip_value", "tip_method",
  "tip", "tip_currency", "tip_cash", "tip_cash_value", "tip_cash_currency", "tip_cash_usd", "tip_cash_mxn",
  "cc_fee", "total_guest", "total_profit", "cash_collected", "accommodation_fare",
  "accommodation_currency", "pay_token", "payment_status", "exchange_rate", "guest_tip",
  "guest_gratuity", "amount_paid", "paid_at", "stripe_session_id", "created_at", "saved_at",
  "notes", "gratuity_waived", "grocery_allocation", "grocery_allocation_currency",
];
const PETTY_COLS = ["booking_ref", "float_amount", "currency", "updated_at", "notes"];

function pick(obj: Record<string, unknown>, cols: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of cols) if (k in obj) out[k] = obj[k];
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const signingKey = Deno.env.get("CONCIERGE_SIGNING_KEY");
    if (!signingKey) return json({ error: "Server not configured" }, 500);

    const body = await req.json().catch(() => ({}));
    const token = typeof body?.token === "string" ? body.token : "";
    if (!(await verifyConciergeToken(token, signingKey))) {
      return json({ error: "Unauthorized" }, 401);
    }

    const op = typeof body?.op === "string" ? body.op : "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const asNum = (v: unknown) => {
      const n = Number(v);
      if (!Number.isFinite(n)) throw new Error("Invalid id");
      return n;
    };

    switch (op) {
      // ---- services ----
      case "services_list": {
        let q = supabase.from("services").select("*");
        if (body.activeOnly) q = q.eq("is_active", true);
        const { data, error } = await q.order("category").order("sort_order");
        if (error) throw error;
        return json({ data });
      }
      case "services_insert": {
        const record = pick(body.record ?? {}, SERVICE_COLS);
        const { error } = await supabase.from("services").insert(record);
        if (error) throw error;
        return json({ ok: true });
      }
      case "services_update": {
        const patch = pick(body.patch ?? {}, SERVICE_COLS);
        const { error } = await supabase.from("services").update(patch).eq("id", asNum(body.id));
        if (error) throw error;
        return json({ ok: true });
      }
      case "services_delete": {
        const { error } = await supabase.from("services").delete().eq("id", asNum(body.id));
        if (error) throw error;
        return json({ ok: true });
      }

      // ---- bookings ----
      case "bookings_list": {
        const { data, error } = await supabase.from("bookings").select("*").order("checkin", { ascending: true });
        if (error) throw error;
        return json({ data });
      }
      case "bookings_insert": {
        const record = pick(body.record ?? {}, BOOKING_COLS);
        const { data, error } = await supabase.from("bookings").insert(record).select("pay_token").single();
        if (error) throw error;
        return json({ data });
      }
      case "bookings_update": {
        const patch = pick(body.patch ?? {}, BOOKING_COLS);
        const { error } = await supabase.from("bookings").update(patch).eq("id", asNum(body.id));
        if (error) throw error;
        return json({ ok: true });
      }
      case "bookings_delete": {
        const { error } = await supabase.from("bookings").delete().eq("id", asNum(body.id));
        if (error) throw error;
        return json({ ok: true });
      }
      case "bookings_upsert": {
        const rows = Array.isArray(body.rows) ? body.rows.map((r: Record<string, unknown>) => pick(r, BOOKING_COLS)) : [];
        const { error } = await supabase.from("bookings").upsert(rows);
        if (error) throw error;
        return json({ ok: true });
      }

      // ---- petty_cash ----
      case "petty_cash_list": {
        const { data, error } = await supabase.from("petty_cash").select("booking_ref, float_amount");
        if (error) throw error;
        return json({ data });
      }
      case "petty_cash_upsert": {
        const row = pick(body.row ?? {}, PETTY_COLS);
        const { error } = await supabase.from("petty_cash").upsert(row, { onConflict: "booking_ref" });
        if (error) throw error;
        return json({ ok: true });
      }

      // ---- reservations (Guesty sync) ----
      case "reservations_list": {
        const { data, error } = await supabase
          .from("reservations")
          .select("id, guesty_id, guest, checkin, checkout, nights, listing_name, status, meal_token")
          .gte("checkout", new Date().toISOString().slice(0, 10))
          .order("checkin", { ascending: true });
        if (error) throw error;
        return json({ data });
      }
      case "reservations_sync": {
        const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/guesty-reservations-sync`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}` },
          body: JSON.stringify({}),
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok) return json({ error: out?.error || "Sync failed" }, 502);
        return json(out);
      }

      default:
        return json({ error: "Unknown op" }, 400);
    }
  } catch (e) {
    return json({ error: (e as Error).message }, 400);
  }
});
