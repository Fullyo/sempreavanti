// Shared verifier for the concierge HMAC session token.
// Mirrors the token format issued by the concierge-auth function:
//   base64url(`${exp}.${nonce}`) + "." + base64url(HMAC-SHA256(signingKey, `${exp}.${nonce}`))

function b64urlDecodeToStr(s: string): string {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return atob(s);
}

function b64urlEncode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function hmac(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  return b64urlEncode(new Uint8Array(sig));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function verifyConciergeToken(token: string, signingKey: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sig] = parts;
  let payload: string;
  try {
    payload = b64urlDecodeToStr(payloadB64);
  } catch {
    return false;
  }
  const expected = await hmac(signingKey, payload);
  if (!constantTimeEqual(sig, expected)) return false;
  const [expStr] = payload.split(".");
  const exp = Number(expStr);
  if (!exp || Date.now() / 1000 > exp) return false;
  return true;
}
