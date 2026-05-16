import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const TOKEN_TTL_SECONDS = 12 * 60 * 60; // 12 hours

function b64urlEncode(bytes: Uint8Array): string {
  let s = btoa(String.fromCharCode(...bytes));
  return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlEncodeStr(str: string): string {
  return b64urlEncode(new TextEncoder().encode(str));
}

async function hmac(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
  return b64urlEncode(new Uint8Array(sig));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function issueToken(signingKey: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const nonceBytes = new Uint8Array(12);
  crypto.getRandomValues(nonceBytes);
  const nonce = b64urlEncode(nonceBytes);
  const payload = `${exp}.${nonce}`;
  const payloadB64 = b64urlEncodeStr(payload);
  const sig = await hmac(signingKey, payload);
  return `${payloadB64}.${sig}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const password = Deno.env.get('CONCIERGE_PASSWORD');
    const signingKey = Deno.env.get('CONCIERGE_SIGNING_KEY');
    if (!password || !signingKey) {
      return new Response(JSON.stringify({ error: 'Server not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const submitted = typeof body?.password === 'string' ? body.password : '';

    // Small artificial delay (basic brute-force friction)
    await new Promise((r) => setTimeout(r, 400));

    if (!constantTimeEqual(submitted, password)) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = await issueToken(signingKey);
    const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
    return new Response(JSON.stringify({ token, exp }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
