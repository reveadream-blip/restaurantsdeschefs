"use client";

import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import { normalizeFichePhotoUrl } from "@/lib/normalizeFicheMediaUrl";
import type { PartnerBannerConfig } from "@/types/partenariat";

export type PartnerBannerProps = {
  config: PartnerBannerConfig;
  /** Variante grille 2 colonnes (page d’accueil sans carte). */
  gridSpan?: boolean;
};

function MarqueBannerVisual({
  imageUrl,
  linkUrl,
  title,
}: {
  imageUrl: string;
  linkUrl: string;
  title: string;
}) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- URL admin
    <img
      src={imageUrl}
      alt={title || "Partenaire"}
      className="max-h-16 w-auto max-w-[min(100%,220px)] object-contain object-left sm:max-h-20"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );

  if (linkUrl) {
    const external = /^https?:\/\//i.test(linkUrl);
    if (external) {
      return (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group inline-flex items-center gap-2 rounded-lg outline-none ring-[var(--rc-gold)] focus-visible:ring-2"
        >
          {img}
          <ExternalLink
            className="h-3.5 w-3.5 shrink-0 text-[var(--rc-text-muted)] opacity-0 transition group-hover:opacity-100"
            aria-hidden
          />
        </a>
      );
    }
    return (
      <Link
        href={linkUrl}
        className="inline-flex rounded-lg outline-none ring-[var(--rc-gold)] focus-visible:ring-2"
      >
        {img}
      </Link>
    );
  }

  return img;
}

/**
 * Bannière partenaire discrète, insérée dans les listes de cartes chefs.
 */
export default function PartnerBanner({
  config,
  gridSpan = false,
}: PartnerBannerProps) {
  if (!config.enabled) return null;

  const isMarque = config.kind === "marque";
  const marqueImage = normalizeFichePhotoUrl(config.marqueImageUrl ?? "");
  const marqueLink = (config.marqueLinkUrl ?? "").trim();

  if (isMarque && marqueImage) {
    return (
      <article
        className={`chef-card-shell relative overflow-hidden rounded-[var(--rc-radius-xl)] border border-[var(--rc-border)] bg-[var(--rc-surface)] shadow-[var(--rc-shadow-soft)] ${
          gridSpan ? "sm:col-span-2" : ""
        }`}
        aria-label="Partenariat de marque"
      >
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <MarqueBannerVisual
            imageUrl={marqueImage}
            linkUrl={marqueLink}
            title={config.title}
          />
          {(config.title || config.subtitle) && (
            <div className="min-w-0 flex-1 border-t border-[var(--rc-border)] pt-3 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
              {config.title ? (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rc-text-muted)]">
                  {config.title}
                </p>
              ) : null}
              {config.subtitle ? (
                <p className="mt-1 text-sm font-light leading-relaxed text-[var(--rc-text)]">
                  {config.subtitle}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </article>
    );
  }

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
