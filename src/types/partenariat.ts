export type AbonnementTier = "local" | "total";

export type PartnerBannerConfig = {
  enabled: boolean;
  interval: number;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

export const DEFAULT_PARTNER_BANNER: PartnerBannerConfig = {
  enabled: true,
  interval: 5,
  title: "Visibilité premium pour votre table",
  subtitle:
    "Apparaissez en tête des recherches dans votre ville — packs dès 9 €/mois.",
  ctaLabel: "Découvrir les packs",
  ctaHref: "/partenaires",
};

export type PartenariatApiResponse = {
  banner: PartnerBannerConfig;
};
