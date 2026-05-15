export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(
  env: {
    RESEND_API_KEY?: string;
    CONTACT_TO_EMAIL?: string;
    CONTACT_FROM_EMAIL?: string;
  },
  payload: ContactPayload
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      reason:
        "Envoi e-mail non configuré : définissez RESEND_API_KEY (secret Workers).",
    };
  }

  const to = (env.CONTACT_TO_EMAIL ?? "contact.restaurantsdeschefs@gmail.com").trim();
  const from =
    env.CONTACT_FROM_EMAIL?.trim() ??
    "Restaurants des Chefs <onboarding@resend.dev>";

  const text = [
    `Nom : ${payload.name}`,
    `E-mail : ${payload.email}`,
    "",
    payload.message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `[Contact] ${payload.subject}`,
      text,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return {
      ok: false,
      reason: errText || `Resend a répondu ${res.status}.`,
    };
  }

  return { ok: true };
}
