"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { PartnerBannerConfig } from "@/types/partenariat";

export type PartnerBannerProps = {
  config: PartnerBannerConfig;
  /** Variante grille 2 colonnes (page d’accueil sans carte). */
  gridSpan?: boolean;
};

/**
 * Bannière partenaire discrète, insérée dans les listes de cartes chefs.
 */
export default function PartnerBanner({
  config,
  gridSpan = false,
}: PartnerBannerProps) {
  if (!config.enabled) return null;

  return (
    <article
      className={`chef-card-shell relative overflow-hidden rounded-[var(--rc-radius-xl)] border border-[var(--rc-gold)]/35 bg-gradient-to-br from-[var(--rc-surface)] via-[var(--rc-page-bg)] to-[var(--rc-gold-soft)]/40 shadow-[var(--rc-shadow-soft)] ${
        gridSpan ? "sm:col-span-2" : ""
      }`}
      aria-label="Offre partenaire Restaurants des Chefs"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--rc-gold)]/10 blur-2xl"
      />
      <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--rc-gold)]/40 bg-[var(--rc-gold-soft)]">
            <Sparkles
              className="h-4 w-4 text-[var(--rc-gold)]"
              strokeWidth={2}
              aria-hidden
            />
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold leading-snug tracking-tight text-[var(--rc-text)] sm:text-xl">
              {config.title}
            </p>
            <p className="mt-1.5 text-sm font-light leading-relaxed text-[var(--rc-text-muted)]">
              {config.subtitle}
            </p>
          </div>
        </div>
        <Link
          href={config.ctaHref || "/partenaires"}
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--rc-gold)]/50 bg-[var(--rc-navy)] px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[var(--rc-navy)]/90"
        >
          {config.ctaLabel}
        </Link>
      </div>
    </article>
  );
}
