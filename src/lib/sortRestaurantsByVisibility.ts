import {
  parseDepartementQueryCodes,
  restaurantDepartementCodes,
  stripAccentsSearch,
} from "@/lib/departementsFranceSearch";
import {
  restaurantAbonnementLocal,
  restaurantAbonnementTotal,
  restaurantMiseEnAvant,
  restaurantSponsoring,
} from "@/lib/restaurantEditorial";
import type { Restaurant } from "@/types/restaurant";

function citySearchMatch(r: Restaurant, qNorm: string): boolean {
  if (!qNorm || qNorm.length < 2) return false;
  const ville = stripAccentsSearch(r.ville);
  if (!ville) return false;
  return ville.includes(qNorm) || qNorm.includes(ville);
}

function deptSearchMatch(
  r: Restaurant,
  deptQuery: Set<string> | null
): boolean {
  if (!deptQuery || deptQuery.size === 0) return false;
  for (const c of restaurantDepartementCodes(r)) {
    if (deptQuery.has(c)) return true;
  }
  return false;
}

function visibilityScore(
  r: Restaurant,
  qNorm: string,
  deptQuery: Set<string> | null
): number {
  const cityHit = citySearchMatch(r, qNorm);
  const deptHit = deptSearchMatch(r, deptQuery);

  if (restaurantAbonnementTotal(r)) {
    let s = 400;
    if (qNorm === "") s += 80;
    if (cityHit || deptHit) s += 200;
    return s;
  }
  if (restaurantAbonnementLocal(r)) {
    let s = 250;
    if (cityHit) s += 200;
    return s;
  }
  if (restaurantSponsoring(r)) return 80;
  return 0;
}

/** Tri : packs total > local (ville) > sponsoring > reste. */
export function sortRestaurantsByVisibility(
  list: Restaurant[],
  searchQuery: string
): Restaurant[] {
  const qNorm = stripAccentsSearch(searchQuery.trim());
  const deptQuery = qNorm ? parseDepartementQueryCodes(qNorm) : null;
  return [...list].sort(
    (a, b) =>
      visibilityScore(b, qNorm, deptQuery) -
      visibilityScore(a, qNorm, deptQuery)
  );
}

function shuffle<T>(a: T[]): T[] {
  const copy = [...a];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Dix tables d’accueil : toutes les fiches sponsorisées (badge / pack) en priorité,
 * ordre d’affichage mélangé à chaque tirage.
 */
export function pickHomepageFeatured(
  list: Restaurant[],
  n: number
): Restaurant[] {
  if (list.length === 0) return [];

  const sponsored = shuffle(list.filter(restaurantMiseEnAvant));
  const others = shuffle(list.filter((r) => !restaurantMiseEnAvant(r)));

  let picked: Restaurant[];
  if (sponsored.length >= n) {
    picked = sponsored.slice(0, n);
  } else {
    picked = [...sponsored, ...others.slice(0, n - sponsored.length)];
  }
  return shuffle(picked);
}
