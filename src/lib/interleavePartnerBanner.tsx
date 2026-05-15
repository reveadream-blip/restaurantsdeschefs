import type { ReactNode } from "react";
import PartnerBanner from "@/components/PartnerBanner";
import type { PartnerBannerConfig } from "@/types/partenariat";

/** Insère une bannière partenaire toutes les `interval` cartes. */
export function interleavePartnerBanner(
  cards: ReactNode[],
  config: PartnerBannerConfig,
  options?: { gridSpan?: boolean; keyPrefix?: string }
): ReactNode[] {
  const interval = Math.max(1, Math.floor(config.interval || 5));
  if (!config.enabled || cards.length === 0) return cards;

  const prefix = options?.keyPrefix ?? "partner";
  const out: ReactNode[] = [];
  let bannerIndex = 0;

  cards.forEach((card, i) => {
    out.push(card);
    if ((i + 1) % interval === 0) {
      bannerIndex += 1;
      out.push(
        <li
          key={`${prefix}-banner-${bannerIndex}`}
          className={options?.gridSpan ? "scroll-mt-6 sm:col-span-2" : "scroll-mt-6"}
        >
          <PartnerBanner config={config} gridSpan={options?.gridSpan} />
        </li>
      );
    }
  });

  return out;
}
