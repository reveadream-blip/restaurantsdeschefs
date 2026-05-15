"use client";

import { useEffect, useState } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-page-bg)] px-3 py-2.5 text-sm text-[var(--rc-text)] outline-none transition focus:border-[var(--rc-gold)] focus:ring-1 focus:ring-[var(--rc-gold)]/30";
const labelClass =
  "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rc-text-muted)]";

export default function ContactForm({
  defaultSubject = "",
}: {
  defaultSubject?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    setSubject((prev) => (prev ? prev : defaultSubject));
  }, [defaultSubject]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, website }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setFeedback({
          type: "err",
          text: data.error ?? "Envoi impossible. Réessayez plus tard.",
        });
        return;
      }
      setFeedback({
        type: "ok",
        text: "Merci, votre message a bien été envoyé. Nous vous répondrons rapidement.",
      });
      setName("");
      setEmail("");
      setSubject(defaultSubject);
      setMessage("");
    } catch {
      setFeedback({
        type: "err",
        text: "Erreur réseau. Vérifiez votre connexion et réessayez.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-[var(--rc-radius-xl)] border border-[var(--rc-border)] bg-[var(--rc-surface)] p-6 shadow-[var(--rc-shadow-soft)] sm:p-8"
      noValidate
    >
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="contact-website">Site web</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Nom
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            E-mail
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Objet
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${fieldClass} resize-y leading-relaxed`}
        />
      </div>

      {feedback ? (
        <p
          role="status"
          className={`text-sm font-light ${
            feedback.type === "ok"
              ? "text-[var(--rc-navy)]"
              : "text-[var(--rc-ruby)]"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-[var(--rc-navy)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {submitting ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}
