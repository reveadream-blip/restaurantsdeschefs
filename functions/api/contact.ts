import { sendContactEmail } from "../lib/sendContactEmail";
import { verifyTurnstileToken } from "../lib/turnstile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function onRequest(context: {
  request: Request;
  env: {
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    RESEND_API_KEY?: string;
    CONTACT_TO_EMAIL?: string;
    CONTACT_FROM_EMAIL?: string;
  };
}): Promise<Response> {
  if (context.request.method === "GET") {
    const siteKey = context.env.TURNSTILE_SITE_KEY?.trim() ?? "";
    return json({
      siteKey,
      ready: Boolean(siteKey && context.env.TURNSTILE_SECRET_KEY?.trim()),
    });
  }

  if (context.request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const secret = context.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    return json(
      {
        error:
          "Formulaire indisponible : configurez TURNSTILE_SECRET_KEY (secret Workers).",
      },
      503
    );
  }

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: "Corps JSON invalide." }, 400);
  }

  const b = body as Record<string, unknown>;
  if (typeof b.website === "string" && b.website.trim()) {
    return json({ ok: true });
  }

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const subject =
    typeof b.subject === "string" && b.subject.trim()
      ? b.subject.trim()
      : "Message depuis Restaurants des Chefs";
  const message = typeof b.message === "string" ? b.message.trim() : "";
  const turnstileToken =
    typeof b.turnstileToken === "string" ? b.turnstileToken.trim() : "";

  if (!name || name.length < 2) {
    return json({ error: "Indiquez votre nom (2 caractères minimum)." }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: "Adresse e-mail invalide." }, 400);
  }
  if (!message || message.length < 10) {
    return json(
      { error: "Votre message doit contenir au moins 10 caractères." },
      400
    );
  }
  if (!turnstileToken) {
    return json({ error: "Validez le captcha avant d'envoyer." }, 400);
  }

  const ip =
    context.request.headers.get("CF-Connecting-IP") ??
    context.request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim();

  const captchaOk = await verifyTurnstileToken(
    turnstileToken,
    secret,
    ip ?? undefined
  );
  if (!captchaOk) {
    return json({ error: "Captcha invalide ou expiré. Réessayez." }, 400);
  }

  const sent = await sendContactEmail(context.env, {
    name,
    email,
    subject,
    message,
  });
  if (!sent.ok) {
    return json({ error: sent.reason }, 503);
  }

  return json({ ok: true });
}
