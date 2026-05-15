import type { MenuFiltre, Restaurant } from "@/types/restaurant";
import {
  departementSearchBlobFromRestaurant,
  parseDepartementQueryCodes,
  restaurantDepartementCodes,
  stripAccentsSearch,
} from "@/lib/departementsFranceSearch";

function menuMatch(
  r: Restaurant,
  filtre: MenuFiltre,
  topChefSaison: number | null
): boolean {
  switch (filtre) {
    case "tous":
      return true;
    case "top-chef":
      if (!r.top_chef) return false;
      if (topChefSaison == null) return true;
      return (
        Array.isArray(r.saisons_top_chef) &&
        r.saisons_top_chef.includes(topChefSaison)
      );
    case "etoiles":
      return r.etoiles_michelin >= 1;
    case "3":
      return r.etoiles_michelin === 3;
    case "2":
      return r.etoiles_michelin === 2;
    case "1":
      return r.etoiles_michelin === 1;
    default:
      return true;
  }
}

function searchBlob(r: Restaurant): string {
  const etoiles =
    r.etoiles_michelin === 0
      ? ""
      : r.etoiles_michelin === 1
        ? "1 etoile 1 etoiles une etoile michelin"
        : r.etoiles_michelin === 2
          ? "2 etoiles deux etoiles michelin"
          : "3 etoiles trois etoiles michelin";

  const top = r.top_chef
    ? "top chef tops chefs topchef candidat emission top chef"
    : "";

  const saisons =
    r.saisons_top_chef && r.saisons_top_chef.length > 0
      ? r.saisons_top_chef.map((s) => `saison ${s}`).join(" ")
      : "";

  const mail = r.email ? stripAccentsSearch(r.email) : "";
  const dept = departementSearchBlobFromRestaurant(r);

  const extra = [
    r.restaurant_adresse,
    r.candidat_parcours?.slice(0, 400),
    r.candidat_diplome,
    r.notes_source?.slice(0, 300),
  ]
    .filter(Boolean)
    .join(" ");
  return stripAccentsSearch(
    `${r.chef_nom} ${r.nom_restaurant} ${r.ville} ${etoiles} ${top} ${saisons} ${mail} ${dept} ${extra}`
  );
}

function searchMatch(
  r: Restaurant,
  qNorm: string,
  deptQuery: Set<string> | null
): boolean {
  if (!qNorm) return true;
  const blob = searchBlob(r);
  if (blob.includes(qNorm)) return true;
  if (deptQuery && deptQuery.size > 0) {
    const rCodes = restaurantDepartementCodes(r);
    for (const d of deptQuery) {
      if (rCodes.has(d)) return true;
    }
  }
  return false;
}

export function filterRestaurants(
  list: Restaurant[],
  filtre: MenuFiltre,
  search: string,
  topChefSaison: number | null = null
): Restaurant[] {
  const qNorm = stripAccentsSearch(search.trim());
  const deptQuery = parseDepartementQueryCodes(search);
  const saison =
    filtre === "top-chef" ? topChefSaison : null;
  return list.filter(
    (r) =>
      menuMatch(r, filtre, saison) && searchMatch(r, qNorm, deptQuery)
  );
}
