import type { Restaurant } from "@/types/restaurant";

/** Mappe une ligne renvoyée par GET /api/etablissements vers le type carte / liste. */
export function mapEtablissementApiRow(
  r: Record<string, unknown>
): Restaurant | null {
  const id = Number(r.id);
  const lat = Number(r.latitude);
  const lng = Number(r.longitude);
  if (!Number.isFinite(id) || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  const stars = Math.min(
    3,
    Math.max(0, Math.round(Number(r.etoiles_michelin ?? 0)))
  ) as 0 | 1 | 2 | 3;
  const emailRaw = r.email;
  return {
    id,
    nom_restaurant: String(r.nom_restaurant ?? ""),
    chef_nom: String(r.chef_nom ?? ""),
    ville: String(r.ville ?? ""),
    etoiles_michelin: stars,
    top_chef: Boolean(r.top_chef),
    latitude: lat,
    longitude: lng,
    telephone: String(r.telephone ?? "").trim(),
    email:
      emailRaw != null && String(emailRaw).trim() !== ""
        ? String(emailRaw).trim()
        : undefined,
  };
}
