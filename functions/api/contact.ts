import { sendContactEmail } from "../lib/sendContactEmail";

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
    RESEND_API_KEY?: string;
    CONTACT_TO_EMAIL?: string;
    CONTACT_FROM_EMAIL?: string;
  };
}): Promise<Response> {
  if (context.request.method !== "POST") {
    return new Response(null, { status: 405 });
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
