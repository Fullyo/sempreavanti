import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

// Public, token-gated gateway for the guest meal planner.
// The long random `meal_token` (a UUID) is the only credential — no login.
//   op "get"  -> returns the reservation info, the menu, and the saved plan/selections
//   op "save" -> upserts the plan fields (times, special requests) and day/course selections

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const UUID_RE = /^[0-9a-f-]{36}$/i;
const COURSES = ["breakfast", "lunch_appetizer", "lunch", "dinner_appetizer", "dinner", "dessert"];

function isSunday(dateStr: string): boolean {
  return new Date(dateStr + "T00:00:00").getUTCDay() === 0;
}

// Build the list of stay days (check-in through the night before check-out).
function stayDays(checkin: string, checkout: string): string[] {
  const out: string[] = [];
  const start = new Date(checkin + "T00:00:00");
  const end = new Date(checkout + "T00:00:00");
  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const token = String(body?.token ?? "").trim();
    const op = String(body?.op ?? "get");
    if (!UUID_RE.test(token)) return json({ error: "Invalid link" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Resolve the reservation from the meal token.
    const { data: reservation, error: rErr } = await supabase
      .from("reservations")
      .select("id, guest, checkin, checkout, listing_name, meal_token")
      .eq("meal_token", token)
      .maybeSingle();
    if (rErr) throw rErr;
    if (!reservation) return json({ error: "This meal planner link is invalid." }, 404);

    // Ensure a meal_plan row exists for this reservation.
    let { data: plan } = await supabase
      .from("meal_plans")
      .select("*")
      .eq("meal_token", token)
      .maybeSingle();
    if (!plan) {
      const { data: created, error: cErr } = await supabase
        .from("meal_plans")
        .insert({
          meal_token: token,
          reservation_id: reservation.id,
          guest: reservation.guest,
          checkin: reservation.checkin,
          checkout: reservation.checkout,
        })
        .select("*")
        .single();
      if (cErr) throw cErr;
      plan = created;
    }

    if (op === "save") {
      // Update plan-level fields.
      const patch: Record<string, unknown> = {};
      if ("breakfast_time" in body) patch.breakfast_time = String(body.breakfast_time ?? "").slice(0, 40);
      if ("lunch_time" in body) patch.lunch_time = String(body.lunch_time ?? "").slice(0, 40);
      if ("special_requests" in body) patch.special_requests = String(body.special_requests ?? "").slice(0, 4000);
      if (Object.keys(patch).length) {
        const { error } = await supabase.from("meal_plans").update(patch).eq("id", plan.id);
        if (error) throw error;
      }

      // Upsert selections. Expect an array of { day, course, dish_id, free_text, skip }.
      const sel = Array.isArray(body.selections) ? body.selections : [];
      const valid = stayDays(reservation.checkin, reservation.checkout);
      const daySet = new Set(valid);
      const rows = sel
        .filter((s: any) => daySet.has(String(s.day)) && COURSES.includes(String(s.course)) && !isSunday(String(s.day)))
        .map((s: any) => ({
          meal_plan_id: plan!.id,
          day: String(s.day),
          course: String(s.course),
          dish_id: s.dish_id && UUID_RE.test(String(s.dish_id)) ? String(s.dish_id) : null,
          free_text: s.free_text ? String(s.free_text).slice(0, 1000) : null,
          skip: s.skip === true,
        }));
      if (rows.length) {
        const { error } = await supabase
          .from("meal_selections")
          .upsert(rows, { onConflict: "meal_plan_id,day,course" });
        if (error) throw error;
      }
      // Re-read the freshly saved plan.
      const { data: freshPlan } = await supabase.from("meal_plans").select("*").eq("id", plan.id).maybeSingle();
      plan = freshPlan ?? plan;
    }

    // Load menu + selections for the response.
    const [{ data: dishes }, { data: selections }] = await Promise.all([
      supabase.from("menu_dishes").select("id, course, name, description, sort_order").eq("is_active", true).order("course").order("sort_order"),
      supabase.from("meal_selections").select("day, course, dish_id, free_text, skip").eq("meal_plan_id", plan.id),
    ]);

    const days = stayDays(reservation.checkin, reservation.checkout).map((d) => ({
      date: d,
      sunday: isSunday(d),
    }));

    return json({
      guest: reservation.guest,
      listingName: reservation.listing_name,
      checkin: reservation.checkin,
      checkout: reservation.checkout,
      days,
      dishes: dishes ?? [],
      plan: {
        breakfast_time: plan.breakfast_time,
        lunch_time: plan.lunch_time,
        special_requests: plan.special_requests,
        updated_at: plan.updated_at,
      },
      selections: selections ?? [],
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
