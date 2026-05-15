/** Session admin : cookie signé (HMAC-SHA256), secret = ADMIN_SESSION_SECRET. */

const COOKIE = "rc_admin";

function toB64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createAdminSessionToken(
  secret: string,
  ttlMs: number
): Promise<string> {
  const payload = { exp: Date.now() + ttlMs };
  const payloadB64 = toB64url(
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  );
  return `${payloadB64}.${toB64url(sig)}`;
}

export async function verifyAdminSessionToken(
  secret: string,
  token: string
): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  if (!payloadB64 || !sigB64) return false;
  let sigBytes: Uint8Array;
  try {
    sigBytes = fromB64url(sigB64);
  } catch {
    return false;
  }
  const key = await hmacKey(secret);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    sigBytes as unknown as BufferSource,
    new TextEncoder().encode(payloadB64)
  );
  if (!ok) return false;
  let payload: { exp?: number };
  try {
    const raw = new TextDecoder().decode(fromB64url(payloadB64));
    payload = JSON.parse(raw) as { exp?: number };
  } catch {
    return false;
  }
  if (typeof payload.exp !== "number" || Date.now() > payload.exp) return false;
  return true;
}

export function readAdminCookie(request: Request): string | null {
  const h = request.headers.get("cookie");
  if (!h) return null;
  for (const part of h.split(";")) {
    const s = part.trim();
    if (s.startsWith(`${COOKIE}=`)) {
      return decodeURIComponent(s.slice(COOKIE.length + 1));
    }
  }
  return null;
}

export function adminCookieHeader(
  token: string,
  maxAgeSec: number
): string {
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${maxAgeSec}`,
    "HttpOnly",
    "SameSite=Lax",
    "Secure",
  ];
  return parts.join("; ");
}

export function adminClearCookieHeader(): string {
  return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure`;
}

export async function isAdminRequest(
  request: Request,
  sessionSecret: string | undefined
): Promise<boolean> {
  if (!sessionSecret) return false;
  const token = readAdminCookie(request);
  if (!token) return false;
  return verifyAdminSessionToken(sessionSecret, token);
}
