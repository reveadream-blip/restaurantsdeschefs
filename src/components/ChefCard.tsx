"use client";

import { Mail, MapPin, Phone, Sparkles, Star } from "lucide-react";
import { normalizeFichePhotoUrl } from "@/lib/normalizeFicheMediaUrl";
import { restaurantFicheEnrichie } from "@/lib/restaurantEditorial";
import type { Restaurant } from "@/types/restaurant";

export type ChefCardProps = {
  restaurant: Restaurant;
  onSelect: () => void;
};

function MichelinStars({ count }: { count: 1 | 2 | 3 }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5 text-[var(--rc-gold)] sm:h-4 sm:w-4"
          fill="currentColor"
          strokeWidth={0}
        />
      ))}
    </span>
  );
}

/**
 * Carte établissement style « haute gastronomie » : visuel premium,
 * badges floutés, typographie serif pour les noms.
 * Le cadre (bordure / mise en avant) est appliqué par le parent qui englobe aussi la fiche détaillée et les liens carte.
 */
export default function ChefCard({ restaurant: r, onSelect }: ChefCardProps) {
  const stars = r.etoiles_michelin;
  const hasStars = stars > 0;
  const coverUrl = normalizeFichePhotoUrl(r.fiche_card_cover_url ?? "");

  return (
    <>
      {/* Hero visuel */}
      <div className="relative h-36 overflow-hidden sm:h-40">
        {coverUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- URL éditoriale */}
            <img
              src={coverUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/25 to-black/40"
            />
          </>
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(135deg,#121212_0%,#2a2418_38%,rgba(154,125,46,0.42)_72%,rgba(196,30,58,0.32)_100%)]"
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

        {restaurantFicheEnrichie(r) ? (
          <div className="absolute left-3 top-3 z-[1] flex items-center gap-1 rounded-full border border-white/30 bg-black/45 px-2.5 py-1 backdrop-blur-md sm:left-4 sm:top-4">
            <Sparkles
              className="h-3.5 w-3.5 shrink-0 text-[#e8d089]"
              strokeWidth={2}
              aria-hidden
            />
            <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/95">
              Enrichie
            </span>
          </div>
        ) : null}

        <div className="absolute right-3 top-3 flex flex-col items-end gap-2 sm:right-4 sm:top-4">
          {hasStars ? (
            <div className="flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 backdrop-blur-md">
              <MichelinStars count={stars as 1 | 2 | 3} />
              <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/90">
                Michelin
              </span>
            </div>
          ) : null}
          {r.top_chef ? (
            <div className="rounded-full border border-white/20 bg-[var(--rc-ruby)]/88 px-3 py-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
              Top Chef
            </div>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-8 sm:px-5 sm:pb-4">
          <p className="font-display line-clamp-2 text-lg font-semibold leading-tight tracking-tight text-white drop-shadow-md sm:text-xl">
            {r.nom_restaurant}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSelect}
        aria-label={`Ouvrir la fiche détaillée — ${r.nom_restaurant}, ${r.chef_nom}`}
        className="group w-full cursor-pointer border-b border-[var(--rc-border)] bg-[var(--rc-surface)] px-4 pb-4 pt-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--rc-gold)] sm:px-5 sm:pt-5"
      >
        <p className="font-display text-[1.05rem] font-semibold leading-snug text-[var(--rc-text)] sm:text-lg">
          {r.chef_nom}
        </p>

        <p className="font-data mt-2 flex items-center gap-1.5 text-sm tracking-wide text-[var(--rc-text-muted)]">
          <MapPin
            className="h-4 w-4 shrink-0 text-[var(--rc-gold)]"
            strokeWidth={1.75}
            aria-hidden
          />
          <span>{r.ville}</span>
        </p>

        {r.saisons_top_chef && r.saisons_top_chef.length > 0 ? (
          <p className="font-data mt-2 text-xs tracking-wide text-[var(--rc-text-muted)]">
            Saisons {r.saisons_top_chef.join(", ")}
          </p>
        ) : null}
      </button>

      <div className="flex flex-wrap gap-2 bg-[var(--rc-page-bg)]/80 px-4 py-3 sm:px-5">
        {r.telephone ? (
          <a
            href={`tel:${r.telephone.replace(/\s/g, "")}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--rc-border)] bg-[var(--rc-surface)] text-[var(--rc-ruby)] shadow-sm transition hover:border-[var(--rc-ruby)] hover:bg-[var(--rc-ruby-soft)]"
            aria-label={`Téléphone — ${r.nom_restaurant}`}
          >
            <Phone className="h-4 w-4" strokeWidth={2} aria-hidden />
          </a>
        ) : null}
        {r.email ? (
          <a
            href={`mailto:${r.email}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--rc-border)] bg-[var(--rc-surface)] text-[var(--rc-text)] shadow-sm transition hover:border-[var(--rc-text-muted)]"
            aria-label={`E-mail — ${r.nom_restaurant}`}
          >
            <Mail className="h-4 w-4" strokeWidth={2} aria-hidden />
          </a>
        ) : null}
      </div>
    </>
  );
}
