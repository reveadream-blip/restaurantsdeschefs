import type { Restaurant } from "@/types/restaurant";

/** Établissement avec contenu éditorial enregistré en base. */
export function restaurantFicheEnrichie(r: Restaurant): boolean {
  return r.fiche_enrichie === true;
}

/** Établissement en sponsoring (case cochée dans l’administration). */
export function restaurantSponsoring(r: Restaurant): boolean {
  return r.sponsoring === true;
}
