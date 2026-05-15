"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";

function ContactPageInner() {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject")?.trim() ?? "";

  return (
    <div className="min-h-screen bg-[var(--rc-page-bg)]">
      <header className="border-b border-[var(--rc-border)] bg-[var(--rc-surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-serif-luxe text-lg font-semibold tracking-tight text-[var(--rc-text)]"
          >
            Restaurants des Chefs
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[var(--rc-ruby)] underline-offset-2 hover:underline"
          >
            {"\u2190 Retour \u00e0 l\u2019annuaire"}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rc-gold)]">
          Contact
        </p>
        <h1 className="font-serif-luxe mt-3 flex items-center justify-center gap-2 text-center text-3xl font-semibold tracking-tight text-[var(--rc-text)] sm:text-4xl">
          <Mail className="h-7 w-7 text-[var(--rc-ruby)]" strokeWidth={1.75} aria-hidden />
          {"Nous \u00e9crire"}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-center text-sm font-light leading-relaxed text-[var(--rc-text-muted)]">
          Une question sur l&apos;annuaire, un pack partenaire ou votre fiche ?
          {
            "Remplissez le formulaire : votre application mail s\u2019ouvrira avec le message pr\u00e9rempli, sans afficher notre adresse sur cette page."
          }
        </p>

        <div className="mt-10">
          <ContactForm defaultSubject={subject} />
        </div>
      </main>
    </div>
  );
}

export default function ContactPageContent() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-[var(--rc-page-bg)] text-sm text-[var(--rc-text-muted)]">
          {"Chargement\u2026"}
        </div>
      }
    >
      <ContactPageInner />
    </Suspense>
  );
}

