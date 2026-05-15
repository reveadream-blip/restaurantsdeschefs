const DEFAULT_BANNER = {
  enabled: true,
  interval: 5,
  kind: "restaurants" as const,
  title: "Visibilité premium pour votre table",
  subtitle:
    "Apparaissez en tête des recherches dans votre ville — packs dès 9 €/mois.",
  ctaLabel: "Découvrir les packs",
  ctaHref: "/partenaires",
  marqueImageUrl: "",
  marqueLinkUrl: "",
};

const DEFAULT_MARQUE_FICHE = {
  enabled: false,
  brandName: "",
  headline: "Partenariat de marque",
  description: "",
  logoUrl: "",
  photoUrl: "",
  linkUrl: "",
  linkLabel: "Découvrir la marque",
};

function clampUrl(v: unknown, max = 2048): string {
  if (typeof v !== "string") return "";
  const t = v.trim();
  if (!t || t.length > max) return t.slice(0, max);
  return t;
}

function parseBanner(o: Record<string, unknown>) {
  const kindRaw = String(o.kind ?? o.bannerKind ?? "restaurants").toLowerCase();
  const kind = kindRaw === "marque" ? "marque" : "restaurants";
  return {
    enabled: o.enabled !== false,
    interval:
      typeof o.interval === "number" && o.interval >= 1
        ? Math.min(20, Math.floor(o.interval))
        : DEFAULT_BANNER.interval,
    kind,
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
    marqueImageUrl: clampUrl(o.marqueImageUrl ?? o.imageUrl),
    marqueLinkUrl: clampUrl(o.marqueLinkUrl ?? o.imageLink),
  };
}

function parseMarqueFiche(o: Record<string, unknown> | null | undefined) {
  if (!o || typeof o !== "object") {
    return { ...DEFAULT_MARQUE_FICHE };
  }
  return {
    enabled: o.enabled === true,
    brandName:
      typeof o.brandName === "string"
        ? o.brandName.trim().slice(0, 120)
        : DEFAULT_MARQUE_FICHE.brandName,
    headline:
      typeof o.headline === "string" && o.headline.trim()
        ? o.headline.trim().slice(0, 200)
        : DEFAULT_MARQUE_FICHE.headline,
    description:
      typeof o.description === "string"
        ? o.description.trim().slice(0, 2000)
        : DEFAULT_MARQUE_FICHE.description,
    logoUrl: clampUrl(o.logoUrl),
    photoUrl: clampUrl(o.photoUrl),
    linkUrl: clampUrl(o.linkUrl),
    linkLabel:
      typeof o.linkLabel === "string" && o.linkLabel.trim()
        ? o.linkLabel.trim().slice(0, 80)
        : DEFAULT_MARQUE_FICHE.linkLabel,
  };
}

export function parsePartenariatSettingsJson(
  raw: string | null | undefined
): { banner: typeof DEFAULT_BANNER; marqueFiche: typeof DEFAULT_MARQUE_FICHE } {
  if (!raw || String(raw).trim() === "") {
    return {
      banner: { ...DEFAULT_BANNER },
      marqueFiche: { ...DEFAULT_MARQUE_FICHE },
    };
  }
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (o.banner && typeof o.banner === "object" && !Array.isArray(o.banner)) {
      return {
        banner: parseBanner(o.banner as Record<string, unknown>),
        marqueFiche: parseMarqueFiche(
          o.marqueFiche as Record<string, unknown> | undefined
        ),
      };
    }
    return {
      banner: parseBanner(o),
      marqueFiche: { ...DEFAULT_MARQUE_FICHE },
    };
  } catch {
    return {
      banner: { ...DEFAULT_BANNER },
      marqueFiche: { ...DEFAULT_MARQUE_FICHE },
    };
  }
}

/** @deprecated Utiliser parsePartenariatSettingsJson */
export function parsePartnerBannerJson(raw: string | null | undefined) {
  return parsePartenariatSettingsJson(raw).banner;
}

export { DEFAULT_BANNER, DEFAULT_MARQUE_FICHE };
