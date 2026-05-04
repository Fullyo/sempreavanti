import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const LK = Deno.env.get("LOVABLE_API_KEY")!;
  const GD = Deno.env.get("GOOGLE_DRIVE_API_KEY")!;
  const SUPA_URL = Deno.env.get("SUPABASE_URL")!;
  const SR = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supa = createClient(SUPA_URL, SR);
  const body = await req.json() as { files: Array<{ key: string; driveId?: string; mime?: string; placeholderText?: string }> };

  const results: any[] = [];
  for (const f of body.files) {
    try {
      let bytes: Uint8Array; let contentType: string;
      if (f.placeholderText) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#FF00FF"/><text x="400" y="300" font-family="monospace" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">MISSING: ${f.placeholderText}</text></svg>`;
        bytes = new TextEncoder().encode(svg);
        contentType = "image/svg+xml";
      } else {
        const r = await fetch(`https://connector-gateway.lovable.dev/google_drive/drive/v3/files/${f.driveId}?alt=media`, {
          headers: { Authorization: `Bearer ${LK}`, "X-Connection-Api-Key": GD },
        });
        if (!r.ok) { results.push({ key: f.key, error: `drive ${r.status}` }); continue; }
        bytes = new Uint8Array(await r.arrayBuffer());
        contentType = f.mime || "application/octet-stream";
      }
      const { error } = await supa.storage.from("site-assets").upload(f.key, bytes, { contentType, upsert: true });
      if (error) { results.push({ key: f.key, error: error.message }); continue; }
      results.push({ key: f.key, ok: true, size: bytes.length });
    } catch (e) {
      results.push({ key: f.key, error: String(e) });
    }
  }
  return new Response(JSON.stringify({ results }), { headers: { ...cors, "Content-Type": "application/json" } });
});
