/** Champs de contact surchargés sur la fiche publique (édition /admin). */
export type FicheContactOverride = {
  telephone?: string;
  email?: string;
  site_web?: string;
  adresse?: string;
  ville?: string;
  chef_nom?: string;
  nom_restaurant?: string;
};

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
  /** Saisons Top Chef (candidat), si connues. */
  saisons_top_chef?: number[];
  /** Fiche candidat / établissement (D1 ou enrichissement local). */
  candidat_parcours?: string;
  candidat_diplome?: string;
  candidat_site_web?: string;
  lien_wikipedia?: string;
  lien_fandom?: string;
  notes_source?: string;
  restaurant_adresse?: string;
  restaurant_site_web?: string;
  /** Intro Wikipédia (fichier enrichi — CC BY-SA). */
  wikipedia_intro?: string;
  wikipedia_article_url?: string;
  wikipedia_article_title?: string;
  wikidata_id?: string;
  /** Contenus éditoriaux (D1 `etablissement_fiches`), fusionnés par l’API. */
  fiche_description?: string;
  fiche_photos?: string[];
  fiche_menu_prix?: string;
  fiche_video_url?: string;
  fiche_contact?: FicheContactOverride;
  /** Image bandeau fiche + carte liste (URL https, D1). */
  fiche_card_cover_url?: string;
};

export type MenuFiltre = "tous" | "top-chef" | "etoiles" | "3" | "2" | "1";
