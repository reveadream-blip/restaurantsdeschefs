export async function verifyTurnstileToken(
  token: string,
  secret: string,
  remoteIp?: string | null
): Promise<boolean> {
  if (!token?.trim() || !secret?.trim()) return false;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body }
  );
  if (!res.ok) return false;

  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}
