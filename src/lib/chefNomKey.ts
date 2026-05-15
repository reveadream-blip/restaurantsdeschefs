/** Clé de déduplication (chef / candidat), sans tenir compte des accents. */
export function chefNomKey(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .trim();
}
