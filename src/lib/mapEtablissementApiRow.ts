import type { FicheContactOverride, Restaurant } from "@/types/restaurant";
import {
  normalizeFichePhotoList,
  normalizeFichePhotoUrl,
} from "@/lib/normalizeFicheMediaUrl";

function optString(v: unknown): string | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s === "" ? undefined : s;
}

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
  let saisons_top_chef: number[] | undefined;
  const rawSaisons = r.saisons_json;
  if (typeof rawSaisons === "string" && rawSaisons.trim() !== "") {
    try {
      const parsed: unknown = JSON.parse(rawSaisons);
      if (
        Array.isArray(parsed) &&
        parsed.every((x) => typeof x === "number" && Number.isFinite(x))
      ) {
        saisons_top_chef = parsed as number[];
      }
    } catch {
      /* ignore */
    }
  }
  const row: Restaurant = {
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
  if (saisons_top_chef != null && saisons_top_chef.length > 0) {
    row.saisons_top_chef = saisons_top_chef;
  }

  const assign = (key: keyof Restaurant, v: unknown) => {
    const s = optString(v);
    if (s != null) (row as Record<string, unknown>)[key] = s;
  };
  assign("candidat_parcours", r.candidat_parcours);
  assign("candidat_diplome", r.candidat_diplome);
  assign("candidat_site_web", r.candidat_site_web);
  assign("lien_fandom", r.lien_fandom);
  assign("notes_source", r.notes_source);
  assign("restaurant_adresse", r.restaurant_adresse);
  assign("restaurant_site_web", r.restaurant_site_web);

  const fd = r.fiche_description;
  if (typeof fd === "string" && fd.trim() !== "") {
    row.fiche_description = fd.trim();
  }
  const fmp = r.fiche_menu_prix;
  if (typeof fmp === "string" && fmp.trim() !== "") {
    row.fiche_menu_prix = fmp.trim();
  }
  const fv = r.fiche_video_url;
  if (typeof fv === "string" && fv.trim() !== "") {
    row.fiche_video_url = fv.trim();
  }
  const fp = r.fiche_photos;
  if (Array.isArray(fp) && fp.length > 0) {
    const urls = fp
      .filter((x): x is string => typeof x === "string" && x.trim() !== "")
      .map((u) => u.trim());
    const normalized = normalizeFichePhotoList(urls);
    if (normalized.length > 0) row.fiche_photos = normalized;
  }
  const fc = r.fiche_contact;
  if (fc && typeof fc === "object" && !Array.isArray(fc)) {
    row.fiche_contact = fc as FicheContactOverride;
  }
  const fcc = r.fiche_card_cover_url;
  if (typeof fcc === "string" && fcc.trim() !== "") {
    const u = normalizeFichePhotoUrl(fcc.trim());
    if (u) row.fiche_card_cover_url = u;
  }
  if (r.fiche_enrichie === true) {
    row.fiche_enrichie = true;
  }
  if (r.sponsoring === true || r.sponsoring === 1) {
    row.sponsoring = true;
  }
  const feu = r.fiche_editor_updated_at;
  if (typeof feu === "string" && feu.trim() !== "") {
    row.fiche_editor_updated_at = feu.trim();
  }

  return row;
}
