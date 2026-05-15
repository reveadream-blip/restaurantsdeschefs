"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
    }
  ) => string;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

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
  const [turnstileToken, setTurnstileToken] = useState("");
  const [siteKey, setSiteKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const scriptReadyRef = useRef(false);

  useEffect(() => {
    setSubject((prev) => (prev ? prev : defaultSubject));
  }, [defaultSubject]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/contact", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { siteKey?: string };
        if (!cancelled && data.siteKey) setSiteKey(data.siteKey);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const renderWidget = useCallback(() => {
    if (!siteKey || !widgetRef.current || !window.turnstile) return;
    if (widgetIdRef.current) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        /* ignore */
      }
    }
    widgetIdRef.current = window.turnstile.render(widgetRef.current, {
      sitekey: siteKey,
      theme: "light",
      callback: (token) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
    });
  }, [siteKey]);

  useEffect(() => {
    if (scriptReadyRef.current && siteKey) renderWidget();
  }, [siteKey, renderWidget]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!turnstileToken) {
      setFeedback({
        type: "err",
        text: "Validez le captcha avant d'envoyer.",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website,
          turnstileToken,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setFeedback({
          type: "err",
          text: data.error ?? "Envoi impossible. Réessayez plus tard.",
        });
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
        setTurnstileToken("");
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
      setTurnstileToken("");
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
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
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => {
          scriptReadyRef.current = true;
          renderWidget();
        }}
      />

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
            <label
              htmlFor="contact-name"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rc-text-muted)]"
            >
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
              className="mt-1.5 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-page-bg)] px-3 py-2.5 text-sm text-[var(--rc-text)] outline-none transition focus:border-[var(--rc-gold)] focus:ring-1 focus:ring-[var(--rc-gold)]/30"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rc-text-muted)]"
            >
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
              className="mt-1.5 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-page-bg)] px-3 py-2.5 text-sm text-[var(--rc-text)] outline-none transition focus:border-[var(--rc-gold)] focus:ring-1 focus:ring-[var(--rc-gold)]/30"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rc-text-muted)]"
          >
            Objet
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-page-bg)] px-3 py-2.5 text-sm text-[var(--rc-text)] outline-none transition focus:border-[var(--rc-gold)] focus:ring-1 focus:ring-[var(--rc-gold)]/30"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rc-text-muted)]"
          >
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
            className="mt-1.5 w-full resize-y rounded-lg border border-[var(--rc-border)] bg-[var(--rc-page-bg)] px-3 py-2.5 text-sm leading-relaxed text-[var(--rc-text)] outline-none transition focus:border-[var(--rc-gold)] focus:ring-1 focus:ring-[var(--rc-gold)]/30"
          />
        </div>

        {!siteKey ? (
          <p className="text-sm font-light text-[var(--rc-ruby)]">
            Le captcha n&apos;est pas encore configuré sur le serveur.
          </p>
        ) : (
          <div ref={widgetRef} className="min-h-[65px]" />
        )}

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
          disabled={submitting || !siteKey}
          className="inline-flex w-full items-center justify-center rounded-full bg-[var(--rc-navy)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {submitting ? "Envoi en cours…" : "Envoyer le message"}
        </button>
      </form>
    </>
  );
}
