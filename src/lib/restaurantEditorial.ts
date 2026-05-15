import type { Restaurant } from "@/types/restaurant";

/** Établissement avec ligne `etablissement_fiches` (contenu éditorial enregistré). */
export function restaurantFicheEnrichie(r: Restaurant): boolean {
  return r.fiche_enrichie === true;
}
