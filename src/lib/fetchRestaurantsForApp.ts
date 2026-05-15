import { mapEtablissementApiRow } from "@/lib/mapEtablissementApiRow";
import {
  mergeRowsWithTopChefCatalog,
  mergeSampleWithTopChefCatalog,
} from "@/lib/topChefCatalogRestaurants";
import { enrichRowsWithWikipediaBundle } from "@/lib/topChefWikipediaEnrich";
import type { Restaurant } from "@/types/restaurant";

function withWikipediaBundle(list: Restaurant[]): Restaurant[] {
  return enrichRowsWithWikipediaBundle(list);
}

export type RestaurantsSource = "d1" | "demo" | "local-dev";

export type FetchRestaurantsResult = {
  rows: Restaurant[];
  source: RestaurantsSource;
  apiHint: string | null;
};

/** Même logique que la page d’accueil : API D1 ou jeu démo. */
export async function fetchRestaurantsForApp(): Promise<FetchRestaurantsResult> {
  const loadDemoRows = async (): Promise<Restaurant[]> => {
    const { sampleRestaurants } = await import("@/data/sampleRestaurants");
    return withWikipediaBundle(
      mergeSampleWithTopChefCatalog(sampleRestaurants)
    );
  };

  const isLocalNextDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  let hint: string | null = null;
  try {
    const res = await fetch("/api/etablissements", { cache: "no-store" });
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      if (
        data &&
        typeof data === "object" &&
        "error" in data &&
        (data as { error?: unknown }).error != null
      ) {
        hint = String((data as { error: unknown }).error);
      } else {
        hint = `Réponse HTTP ${res.status}`;
      }
      throw new Error("bad-status");
    }
    if (!Array.isArray(data)) {
      hint = "Réponse JSON invalide (un tableau était attendu).";
      throw new Error("bad-json");
    }
    const mapped = data
      .map((x) => mapEtablissementApiRow(x as Record<string, unknown>))
      .filter((x): x is Restaurant => x != null);
    if (mapped.length > 0) {
      return {
        rows: withWikipediaBundle(mergeRowsWithTopChefCatalog(mapped)),
        source: "d1",
        apiHint: null,
      };
    }
    const demo = await loadDemoRows();
    hint =
      data.length === 0
        ? "Aucune ligne en base (ou requête vide). Importez schema.sql puis lancez : npm run db:seed:demo"
        : "Des lignes existent mais sans latitude / longitude valides pour la carte.";
    return { rows: demo, source: "demo", apiHint: hint };
  } catch {
    const demo = await loadDemoRows();
    const src: RestaurantsSource = isLocalNextDev ? "local-dev" : "demo";
    if (hint === null) {
      hint =
        "Impossible de joindre /api/etablissements ou réponse illisible (réseau, CORS, ou route absente).";
    }
    return {
      rows: demo,
      source: src,
      apiHint: src === "local-dev" ? null : hint,
    };
  }
}
