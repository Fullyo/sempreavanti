import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const OPEN_API = "https://open-api.guesty.com";

async function getToken(supabase: ReturnType<typeof createClient>): Promise<string> {
  const { data: cached } = await supabase
    .from("guesty_cache").select("value, expires_at").eq("key", "open_api_token").maybeSingle();
  if (cached && new Date(cached.expires_at as string) > new Date()) {
    return (cached.value as { token: string }).token;
  }
  const clientId = Deno.env.get("GUESTY_OPEN_API_CLIENT_ID")!;
  const clientSecret = Deno.env.get("GUESTY_OPEN_API_CLIENT_SECRET")!;
  const res = await fetch(`${OPEN_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: "open-api", client_id: clientId, client_secret: clientSecret }),
  });
  const data = await res.json();
  return data.access_token as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const accessToken = await getToken(supabase);
    const today = new Date().toISOString().slice(0, 10);
    const url = new URL(`${OPEN_API}/v1/reservations`);
    url.searchParams.set("limit", "3");
    url.searchParams.set("checkOutDateFrom", today);
    url.searchParams.set("sort", "checkIn");
    url.searchParams.set("fields", "guest.fullName checkIn checkOut listingId status money money.fareAccommodation money.hostPayout money.currency");
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } });
    const data = await res.json();
    const results: any[] = data.results || data.data || [];
    const out = results.map((r) => ({ guest: r.guest?.fullName, money: r.money ?? null, keys: Object.keys(r) }));
    return new Response(JSON.stringify({ count: data.count, out }, null, 2), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
