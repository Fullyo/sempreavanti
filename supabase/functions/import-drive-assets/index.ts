import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

// Only safe path prefixes are allowed for storage uploads (defense against path traversal).
const KEY_REGEX = /^[a-zA-Z0-9/_.-]+$/;

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  // Require service-role bearer token. This is an admin-only ingestion endpoint.
  const auth = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  const SR = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!auth || auth !== SR) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const LK = Deno.env.get("LOVABLE_API_KEY")!;
  const GD = Deno.env.get("GOOGLE_DRIVE_API_KEY")!;
  const SUPA_URL = Deno.env.get("SUPABASE_URL")!;
  const supa = createClient(SUPA_URL, SR);

  let body: { files?: Array<{ key: string; driveId?: string; mime?: string; placeholderText?: string }> };
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }
  if (!body?.files || !Array.isArray(body.files)) {
    return new Response(JSON.stringify({ error: "files array required" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const results: any[] = [];
  for (const f of body.files) {
    if (!f.key || typeof f.key !== "string" || !KEY_REGEX.test(f.key) || f.key.includes("..")) {
      results.push({ key: f.key, error: "invalid key" });
      continue;
    }
    try {
      let bytes: Uint8Array; let contentType: string;
      if (f.placeholderText) {
        const safe = String(f.placeholderText).replace(/[<>&]/g, "").slice(0, 200);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#FF00FF"/><text x="400" y="300" font-family="monospace" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">MISSING: ${safe}</text></svg>`;
        bytes = new TextEncoder().encode(svg);
        contentType = "image/svg+xml";
      } else {
        if (!f.driveId || !/^[a-zA-Z0-9_-]+$/.test(f.driveId)) {
          results.push({ key: f.key, error: "invalid driveId" });
          continue;
        }
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
