import type { AbonnementTier } from "@/types/partenariat";
import type { Restaurant } from "@/types/restaurant";

/** Établissement avec contenu éditorial enregistré en base. */
export function restaurantFicheEnrichie(r: Restaurant): boolean {
  return r.fiche_enrichie === true;
}

/** Établissement en sponsoring (case cochée dans l’administration). */
export function restaurantSponsoring(r: Restaurant): boolean {
  return r.sponsoring === true;
}

export function restaurantAbonnementTier(
  r: Restaurant
): AbonnementTier | null {
  const t = r.abonnement_tier;
  return t === "local" || t === "total" ? t : null;
}

export function restaurantAbonnementLocal(r: Restaurant): boolean {
  const t = restaurantAbonnementTier(r);
  return t === "local" || t === "total";
}

export function restaurantAbonnementTotal(r: Restaurant): boolean {
  return restaurantAbonnementTier(r) === "total";
}

/** Badge « Sponsorisé » et contour doré (sponsoring manuel ou abonnement). */
export function restaurantMiseEnAvant(r: Restaurant): boolean {
  return restaurantSponsoring(r) || restaurantAbonnementLocal(r);
}

/** Éligible aux 10 tables d’accueil (pack total + fiche complète). */
export function restaurantAccueilEligible(r: Restaurant): boolean {
  if (!restaurantAbonnementTotal(r)) return false;
  return (
    restaurantFicheEnrichie(r) ||
    Boolean(r.fiche_description?.trim()) ||
    Boolean(r.fiche_card_cover_url)
  );
}
