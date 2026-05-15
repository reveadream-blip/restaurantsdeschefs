import {
  adminCookieHeader,
  createAdminSessionToken,
} from "../../lib/adminSession";

const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_AGE_SEC = 7 * 24 * 60 * 60;

const DEFAULT_ADMIN_EMAIL = "reveadream@gmail.com";

export async function onRequest(context: {
  request: Request;
  env: {
    ADMIN_PASSWORD?: string;
    ADMIN_SESSION_SECRET?: string;
    ADMIN_EMAIL?: string;
  };
}): Promise<Response> {
  if (context.request.method !== "POST") {
    return new Response(null, { status: 405 });
  }
  const pass = context.env.ADMIN_PASSWORD;
  const secret = context.env.ADMIN_SESSION_SECRET;
  if (!pass || !secret) {
    return Response.json(
      {
        error:
          "Administration non configurée : définissez ADMIN_PASSWORD et ADMIN_SESSION_SECRET (secrets Workers). Optionnel : ADMIN_EMAIL pour remplacer l’e-mail autorisé.",
      },
      { status: 503 }
    );
  }
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: "Corps JSON invalide." }, { status: 400 });
  }
  const allowedEmail = (
    context.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL
  )
    .toLowerCase()
    .trim();
  const email =
    body &&
    typeof body === "object" &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email.toLowerCase().trim()
      : "";
  if (!email || email !== allowedEmail) {
    return Response.json(
      { error: "Adresse e-mail non autorisée pour l’administration." },
      { status: 401 }
    );
  }
  const pwd =
    body &&
    typeof body === "object" &&
    "password" in body &&
    typeof (body as { password: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";
  if (pwd !== pass) {
    return Response.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }
  const token = await createAdminSessionToken(secret, TTL_MS);
  return Response.json(
    { ok: true },
    {
      headers: {
        "set-cookie": adminCookieHeader(token, MAX_AGE_SEC),
      },
    }
  );
}
