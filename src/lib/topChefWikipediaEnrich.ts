import type { Restaurant } from "@/types/restaurant";

/** Ne fusionne plus Wikipédia dans les fiches (demande produit). */
export function enrichRestaurantWithWikipediaBundle(r: Restaurant): Restaurant {
  return r;
}

export function enrichRowsWithWikipediaBundle(rows: Restaurant[]): Restaurant[] {
  return rows.map(enrichRestaurantWithWikipediaBundle);
}
