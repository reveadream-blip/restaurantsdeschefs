"use client";

import { ExternalLink } from "lucide-react";
import type { Restaurant } from "@/types/restaurant";

function hasText(s: string | undefined): boolean {
  return s != null && s.trim() !== "";
}

function linkLabel(url: string, fallback: string): string {
  try {
    const h = new URL(url).hostname;
    return h.replace(/^www\./, "") || fallback;
  } catch {
    return fallback;
  }
}

export function restaurantHasExtendedFiche(r: Restaurant): boolean {
  if (r.top_chef) return true;
  return (
    hasText(r.restaurant_adresse) ||
    hasText(r.restaurant_site_web) ||
    hasText(r.candidat_parcours) ||
    hasText(r.candidat_diplome) ||
    hasText(r.candidat_site_web) ||
    hasText(r.lien_fandom) ||
    hasText(r.notes_source)
  );
}

export default function RestaurantFicheDetails({
  restaurant: r,
}: {
  restaurant: Restaurant;
}) {
  if (!restaurantHasExtendedFiche(r)) return null;

  const showEtablissement =
    hasText(r.restaurant_adresse) ||
    hasText(r.restaurant_site_web) ||
    (r.top_chef && hasText(r.ville));

  return (
    <div className="font-data border-t border-[var(--rc-border)] bg-[var(--rc-page-bg)]/90 px-4 py-4 text-left text-sm text-[var(--rc-text)]">
      {showEtablissement && (
        <div className="mb-3 space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--rc-text-muted)]">
            Établissement
          </p>
          {hasText(r.restaurant_adresse) ? (
            <p className="text-sm leading-snug">{r.restaurant_adresse}</p>
          ) : r.top_chef && hasText(r.ville) ? (
            <p className="text-sm leading-snug text-[var(--rc-text-muted)]">
              {r.ville}
            </p>
          ) : null}
          {hasText(r.restaurant_site_web) ? (
            <a
              href={r.restaurant_site_web}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--rc-ruby)] underline decoration-[var(--rc-ruby-soft)] underline-offset-2 hover:opacity-90"
            >
              {linkLabel(r.restaurant_site_web!, "Site web")}
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
            </a>
          ) : null}
        </div>
      )}

      {r.top_chef && (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--rc-text-muted)]">
            Candidat Top Chef
          </p>
          {r.saisons_top_chef && r.saisons_top_chef.length > 0 ? (
            <p className="text-sm text-[var(--rc-text)]">
              <span className="font-normal">Saisons : </span>
              {r.saisons_top_chef.join(", ")}
            </p>
          ) : null}
          {hasText(r.candidat_diplome) ? (
            <p>
              <span className="font-normal text-[var(--rc-text)]">
                Formation / diplôme :{" "}
              </span>
              {r.candidat_diplome}
            </p>
          ) : null}
          {hasText(r.candidat_parcours) ? (
            <div>
              <p className="mb-1 font-normal text-[var(--rc-text)]">Parcours</p>
              <p className="max-h-40 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-[var(--rc-text-muted)]">
                {r.candidat_parcours}
              </p>
            </div>
          ) : null}
          {hasText(r.candidat_site_web) ? (
            <a
              href={r.candidat_site_web}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--rc-ruby)] underline decoration-[var(--rc-ruby-soft)] underline-offset-2 hover:opacity-90"
            >
              Site du candidat
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
            </a>
          ) : null}
          {hasText(r.lien_fandom) ? (
            <a
              href={r.lien_fandom}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--rc-ruby)] underline decoration-[var(--rc-ruby-soft)] underline-offset-2 hover:opacity-90"
            >
              Fandom Top Chef
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
            </a>
          ) : null}
          {hasText(r.notes_source) ? (
            <div>
              <p className="mb-1 text-xs font-normal text-[var(--rc-text-muted)]">
                Notes sources
              </p>
              <p className="max-h-24 overflow-y-auto whitespace-pre-wrap text-xs text-[var(--rc-text-muted)]">
                {r.notes_source}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
