export type AbonnementTier = "local" | "total";

/** Bannière insérée dans les listes : offre restaurateurs ou logo marque. */
export type PartnerBannerKind = "restaurants" | "marque";

export type PartnerBannerConfig = {
  enabled: boolean;
  interval: number;
  kind: PartnerBannerKind;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  /** Logo ou photo (URL https) — mode marque */
  marqueImageUrl?: string;
  /** Lien au clic sur le visuel — mode marque */
  marqueLinkUrl?: string;
};

/** Fiche « partenariat de marque » sur /partenaires */
export type MarquePartenariatFiche = {
  enabled: boolean;
  brandName: string;
  headline: string;
  description: string;
  logoUrl: string;
  /** Photo optionnelle (bannière large) */
  photoUrl?: string;
  linkUrl: string;
  linkLabel: string;
};

export type PartenariatSettings = {
  banner: PartnerBannerConfig;
  marqueFiche: MarquePartenariatFiche;
};

export const DEFAULT_PARTNER_BANNER: PartnerBannerConfig = {
  enabled: true,
  interval: 5,
  kind: "restaurants",
  title: "Visibilité premium pour votre table",
  subtitle:
    "Apparaissez en tête des recherches dans votre ville — packs dès 9 €/mois.",
  ctaLabel: "Découvrir les packs",
  ctaHref: "/partenaires",
};

export const DEFAULT_MARQUE_FICHE: MarquePartenariatFiche = {
  enabled: false,
  brandName: "",
  headline: "Partenariat de marque",
  description: "",
  logoUrl: "",
  photoUrl: "",
  linkUrl: "",
  linkLabel: "Découvrir la marque",
};

export const DEFAULT_PARTENARIAT_SETTINGS: PartenariatSettings = {
  banner: DEFAULT_PARTNER_BANNER,
  marqueFiche: DEFAULT_MARQUE_FICHE,
};

export type PartenariatApiResponse = PartenariatSettings;
