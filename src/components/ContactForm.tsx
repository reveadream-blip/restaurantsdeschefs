"use client";

import { useEffect, useState } from "react";
import { buildContactMailtoUrl, openContactMailto } from "@/lib/contactMailto";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-page-bg)] px-3 py-2.5 text-sm text-[var(--rc-text)] outline-none transition focus:border-[var(--rc-gold)] focus:ring-1 focus:ring-[var(--rc-gold)]/30";
const labelClass =
  "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rc-text-muted)]";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    setSubject((prev) => (prev ? prev : defaultSubject));
  }, [defaultSubject]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (website.trim()) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      setFeedback({
        type: "err",
        text: "Indiquez votre nom (2 caractères minimum).",
      });
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setFeedback({ type: "err", text: "Adresse e-mail invalide." });
      return;
    }
    if (trimmedMessage.length < 10) {
      setFeedback({
        type: "err",
        text: "Votre message doit contenir au moins 10 caractères.",
      });
      return;
    }

    const mailto = buildContactMailtoUrl({
      name: trimmedName,
      email: trimmedEmail,
      subject: subject.trim(),
      message: trimmedMessage,
    });

    window.location.href = mailto;

    setFeedback({
      type: "ok",
      text: "Votre application mail va s'ouvrir : vérifiez le message puis envoyez-le.",
    });
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
        className="inline-flex w-full items-center justify-center rounded-full bg-[var(--rc-navy)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto"
      >
        Envoyer le message
      </button>
    </form>
  );
}