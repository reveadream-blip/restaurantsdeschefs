import type { MenuFiltre, Restaurant } from "@/types/restaurant";

function stripAccents(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function menuMatch(r: Restaurant, filtre: MenuFiltre): boolean {
  switch (filtre) {
    case "tous":
      return true;
    case "top-chef":
      return r.top_chef;
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

  const mail = r.email ? stripAccents(r.email) : "";
  return stripAccents(
    `${r.chef_nom} ${r.nom_restaurant} ${r.ville} ${etoiles} ${top} ${mail}`
  );
}

function searchMatch(r: Restaurant, raw: string): boolean {
  const q = stripAccents(raw.trim());
  if (!q) return true;
  return searchBlob(r).includes(q);
}

export function filterRestaurants(
  list: Restaurant[],
  filtre: MenuFiltre,
  search: string
): Restaurant[] {
  return list.filter((r) => menuMatch(r, filtre) && searchMatch(r, search));
}
