const DEFAULT_BANNER = {
  enabled: true,
  interval: 5,
  title: "Visibilité premium pour votre table",
  subtitle:
    "Apparaissez en tête des recherches dans votre ville — packs dès 9 €/mois.",
  ctaLabel: "Découvrir les packs",
  ctaHref: "/partenaires",
};

export function parsePartnerBannerJson(raw: string | null | undefined): typeof DEFAULT_BANNER {
  if (!raw || String(raw).trim() === "") return DEFAULT_BANNER;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    return {
      enabled: o.enabled !== false,
      interval:
        typeof o.interval === "number" && o.interval >= 1
          ? Math.min(20, Math.floor(o.interval))
          : DEFAULT_BANNER.interval,
      title:
        typeof o.title === "string" && o.title.trim()
          ? o.title.trim().slice(0, 200)
          : DEFAULT_BANNER.title,
      subtitle:
        typeof o.subtitle === "string" && o.subtitle.trim()
          ? o.subtitle.trim().slice(0, 400)
          : DEFAULT_BANNER.subtitle,
      ctaLabel:
        typeof o.ctaLabel === "string" && o.ctaLabel.trim()
          ? o.ctaLabel.trim().slice(0, 80)
          : DEFAULT_BANNER.ctaLabel,
      ctaHref:
        typeof o.ctaHref === "string" && o.ctaHref.trim()
          ? o.ctaHref.trim().slice(0, 200)
          : DEFAULT_BANNER.ctaHref,
    };
  } catch {
    return DEFAULT_BANNER;
  }
}

export { DEFAULT_BANNER };
