import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { normalizeFichePhotoUrl } from "@/lib/normalizeFicheMediaUrl";
import type { MarquePartenariatFiche } from "@/types/partenariat";

/** Vitrine du partenaire marque actif (contenu admin), sous le pack 19 €. */
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
  const hasContent =
    logo || photo || fiche.description?.trim() || fiche.brandName?.trim();

  if (!hasContent) return null;

  const Cta = link
    ? external
      ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-[var(--rc-border-strong)] bg-[var(--rc-page-bg)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rc-text)] transition hover:border-[var(--rc-gold)]"
          >
            {fiche.linkLabel || "Découvrir la marque"}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )
      : (
          <Link
            href={link}
            className="mt-5 inline-flex items-center justify-center rounded-full border border-[var(--rc-border-strong)] bg-[var(--rc-page-bg)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rc-text)] transition hover:border-[var(--rc-gold)]"
          >
            {fiche.linkLabel || "Découvrir la marque"}
          </Link>
        )
    : null;

  return (
    <div
      className="mt-6 overflow-hidden rounded-[var(--rc-radius-xl)] border border-[var(--rc-border)] bg-[var(--rc-surface)] shadow-[var(--rc-shadow-soft)]"
      aria-labelledby="partenaire-actif-titre"
    >
      {photo ? (
        <div className="relative h-36 w-full bg-[var(--rc-page-bg)] sm:h-44">
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
            className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"
          />
        </div>
      ) : null}

      <div className="p-5 sm:p-6">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--rc-text-muted)]">
          Partenaire à la une
        </p>
        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-start">
          {logo ? (
            <div className="flex shrink-0 items-center justify-center rounded-lg border border-[var(--rc-border)] bg-[var(--rc-page-bg)] p-3 sm:w-36">
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
                    className="max-h-16 w-full object-contain"
                    loading="lazy"
                  />
                </a>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={fiche.brandName || "Logo partenaire"}
                  className="max-h-16 w-full object-contain"
                  loading="lazy"
                />
              )}
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <h3
              id="partenaire-actif-titre"
              className="font-serif-luxe text-lg font-semibold text-[var(--rc-text)] sm:text-xl"
            >
              {fiche.headline || fiche.brandName || "Notre partenaire"}
            </h3>
            {fiche.brandName && fiche.headline ? (
              <p className="mt-0.5 text-sm text-[var(--rc-text-muted)]">
                {fiche.brandName}
              </p>
            ) : null}
            {fiche.description ? (
              <p className="mt-3 whitespace-pre-wrap text-sm font-light leading-relaxed text-[var(--rc-text)]">
                {fiche.description}
              </p>
            ) : null}
            {Cta}
          </div>
        </div>
      </div>
    </div>
  );
}

