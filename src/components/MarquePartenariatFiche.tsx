import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { normalizeFichePhotoUrl } from "@/lib/normalizeFicheMediaUrl";
import type { MarquePartenariatFiche } from "@/types/partenariat";

export default function MarquePartenariatFicheCard({
  fiche,
}: {
  fiche: MarquePartenariatFiche;
}) {
  if (!fiche.enabled) return null;

  const logo = normalizeFichePhotoUrl(fiche.logoUrl);
  const photo = normalizeFichePhotoUrl(fiche.photoUrl ?? "");
  const link = fiche.linkUrl.trim();
  const external = /^https?:\/\//i.test(link);

  const Cta = link
    ? external
      ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[var(--rc-gold)]/50 bg-[var(--rc-navy)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90"
          >
            {fiche.linkLabel || "Découvrir la marque"}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )
      : (
          <Link
            href={link}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-[var(--rc-gold)]/50 bg-[var(--rc-navy)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90"
          >
            {fiche.linkLabel || "Découvrir la marque"}
          </Link>
        )
    : null;

  return (
    <section
      id="partenariat-marque"
      className="mt-16 scroll-mt-8 rounded-[var(--rc-radius-xl)] border border-[var(--rc-border)] bg-[var(--rc-surface)] shadow-[var(--rc-shadow-soft)] overflow-hidden"
      aria-labelledby="partenariat-marque-titre"
    >
      {photo ? (
        <div className="relative h-40 w-full bg-[var(--rc-page-bg)] sm:h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
          />
        </div>
      ) : null}

      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rc-gold)]">
          Partenariat de marque
        </p>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start">
          {logo ? (
            <div className="flex shrink-0 items-center justify-center rounded-xl border border-[var(--rc-border)] bg-[var(--rc-page-bg)] p-4 sm:w-40">
              {link ? (
                <a
                  href={link}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer sponsored" : undefined}
                  className="block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt={fiche.brandName || "Logo partenaire"}
                    className="max-h-20 w-full object-contain"
                    loading="lazy"
                  />
                </a>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={fiche.brandName || "Logo partenaire"}
                  className="max-h-20 w-full object-contain"
                  loading="lazy"
                />
              )}
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <h2
              id="partenariat-marque-titre"
              className="font-serif-luxe text-2xl font-semibold tracking-tight text-[var(--rc-text)] sm:text-3xl"
            >
              {fiche.headline || fiche.brandName || "Notre partenaire"}
            </h2>
            {fiche.brandName && fiche.headline ? (
              <p className="mt-1 text-sm font-medium text-[var(--rc-text-muted)]">
                {fiche.brandName}
              </p>
            ) : null}
            {fiche.description ? (
              <p className="mt-4 whitespace-pre-wrap text-sm font-light leading-relaxed text-[var(--rc-text)] sm:text-base">
                {fiche.description}
              </p>
            ) : null}
            {Cta}
          </div>
        </div>
      </div>
    </section>
  );
}
