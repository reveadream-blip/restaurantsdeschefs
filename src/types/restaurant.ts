/** Données affichées : coordonnées de contact = restaurant uniquement (pas de données perso chef). */
export type Restaurant = {
  id: number;
  nom_restaurant: string;
  chef_nom: string;
  ville: string;
  etoiles_michelin: 0 | 1 | 2 | 3;
  top_chef: boolean;
  latitude: number;
  longitude: number;
  /** Téléphone du restaurant (accueil / réservation). */
  telephone: string;
  /** E-mail du restaurant (contact ou résa), si communiqué publiquement. */
  email?: string;
};

export type MenuFiltre = "tous" | "top-chef" | "3" | "2" | "1";
