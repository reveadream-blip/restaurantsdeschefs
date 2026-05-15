import type { Restaurant } from "@/types/restaurant";

/**
 * Les candidats Top Chef sans entrée `top_chef_restaurants` géolocalisée ne sont plus fusionnés côté client.
 * Ces fonctions ne font que renvoyer la liste telle quelle (compatibilité des imports).
 */
export function mergeSampleWithTopChefCatalog(
  samples: Restaurant[]
): Restaurant[] {
  return samples;
}

export function mergeRowsWithTopChefCatalog(rows: Restaurant[]): Restaurant[] {
  return rows;
}
