/**
 * GET /api/etablissements — établissements Michelin + lignes `top_chef_restaurants` (D1, binding `DB`).
 *
 * - Ligne Michelin : `top_chef` si le nom du chef = candidat ou si `chefs.top_chef_saison` est renseigné.
 * - Chaque ligne `top_chef_restaurants` géolocalisée est renvoyée en plus (id 800000000 + r.id), sauf si elle
 *   ne ferait que doubler la ligne Michelin **déjà** portée par le même chef-candidat au même restaurant
 *   (même nom d’établissement + mêmes coordonnées). Sinon le candidat disparaissait alors que le chef en base
 *   porte un autre nom (cas fréquent dans le CSV).
 */
import { normalizePhotoUrl, normalizePhotoUrlList } from "../lib/normalizePhotoUrl";

type D1Result<T = Record<string, unknown>> = { results?: T[] };

type D1Statement = {
  bind: (...args: unknown[]) => D1Statement;
  all: <T = Record<string, unknown>>() => Promise<D1Result<T>>;
};

type D1Database = {
  prepare: (q: string) => D1Statement;
};

const SAME_PLACE_LAT = 0.00005;
const SAME_PLACE_LNG = 0.00005;

const MICHELIN_SQL = `SELECT e.id,
                e.nom_restaurant,
                e.etoiles_michelin,
                e.ville,
                e.latitude,
                e.longitude,
                e.telephone,
                e.email,
                ch.nom AS chef_nom,
                CASE WHEN tc.id IS NOT NULL OR ch.top_chef_saison IS NOT NULL THEN 1 ELSE 0 END AS top_chef,
                tc.saisons_json AS saisons_json,
                tc.parcours AS candidat_parcours,
                tc.diplome AS candidat_diplome,
                tc.site_web AS candidat_site_web,
                NULL AS lien_wikipedia,
                tc.lien_fandom AS lien_fandom,
                tc.notes_source AS notes_source,
                e.adresse AS restaurant_adresse,
                e.site_web AS restaurant_site_web
         FROM etablissements e
         INNER JOIN chefs ch ON ch.id = e.chef_id
         LEFT JOIN top_chef_candidats tc
           ON LOWER(TRIM(tc.nom_complet)) = LOWER(TRIM(ch.nom))
         WHERE e.latitude IS NOT NULL AND e.longitude IS NOT NULL`;

/** Une ligne par restaurant candidat ; pas d’exclusion « tout établissement au même GPS ». */
const TOP_CHEF_SQL = `SELECT
                (800000000 + r.id) AS id,
                COALESCE(NULLIF(TRIM(r.nom_restaurant), ''), 'Restaurant') AS nom_restaurant,
                COALESCE(r.etoiles_michelin, 0) AS etoiles_michelin,
                COALESCE(TRIM(r.ville), '') AS ville,
                r.latitude AS latitude,
                r.longitude AS longitude,
                TRIM(COALESCE(r.telephone, '')) AS telephone,
                r.email AS email,
                c.nom_complet AS chef_nom,
                1 AS top_chef,
                c.saisons_json AS saisons_json,
                c.parcours AS candidat_parcours,
                c.diplome AS candidat_diplome,
                c.site_web AS candidat_site_web,
                NULL AS lien_wikipedia,
                c.lien_fandom AS lien_fandom,
                c.notes_source AS notes_source,
                r.adresse AS restaurant_adresse,
                r.site_web AS restaurant_site_web
         FROM top_chef_restaurants r
         INNER JOIN top_chef_candidats c ON c.id = r.candidat_id
         WHERE r.latitude IS NOT NULL
           AND r.longitude IS NOT NULL
           AND COALESCE(r.est_actif, 1) = 1
           AND NOT EXISTS (
             SELECT 1
             FROM etablissements e
             INNER JOIN chefs ch ON ch.id = e.chef_id
             WHERE e.latitude IS NOT NULL
               AND e.longitude IS NOT NULL
               AND ABS(e.latitude - r.latitude) < ${SAME_PLACE_LAT}
               AND ABS(e.longitude - r.longitude) < ${SAME_PLACE_LNG}
               AND LOWER(TRIM(e.nom_restaurant)) = LOWER(TRIM(r.nom_restaurant))
               AND LOWER(TRIM(ch.nom)) = LOWER(TRIM(c.nom_complet))
           )`;

type FicheRow = {
  etablissement_id: number;
  description_text: string | null;
  photos_json: string | null;
  menu_prix: string | null;
  video_url: string | null;
  contact_json: string | null;
  card_cover_url: string | null;
  sponsoring?: number | null;
  updated_at: string | null;
};

function ficheRowHasEditorialContent(f: FicheRow): boolean {
  if (f.description_text != null && String(f.description_text).trim() !== "")
    return true;
  if (f.menu_prix != null && String(f.menu_prix).trim() !== "") return true;
  if (f.video_url != null && String(f.video_url).trim() !== "") return true;
  if (f.card_cover_url != null && String(f.card_cover_url).trim() !== "")
    return true;
  if (f.photos_json) {
    try {
      const p: unknown = JSON.parse(f.photos_json);
      if (
        Array.isArray(p) &&
        p.some((x) => typeof x === "string" && x.trim() !== "")
      )
        return true;
    } catch {
      /* ignore */
    }
  }
  if (f.contact_json) {
    try {
      const c: unknown = JSON.parse(f.contact_json);
      if (c && typeof c === "object" && !Array.isArray(c)) {
        if (Object.keys(c as Record<string, unknown>).length > 0) return true;
      }
    } catch {
      /* ignore */
    }
  }
  return false;
}

function ficheRowSponsoring(f: FicheRow): boolean {
  return f.sponsoring === 1 || f.sponsoring === true;
}

async function mergeEditorialFiches(
  db: D1Database,
  rows: Record<string, unknown>[]
): Promise<void> {
  const ids = [
    ...new Set(
      rows
        .map((r) => Number(r.id))
        .filter((n) => Number.isFinite(n) && n > 0)
    ),
  ];
  if (ids.length === 0) return;
  const map = new Map<number, FicheRow>();
  const BATCH = 64;
  for (let i = 0; i < ids.length; i += BATCH) {
    const slice = ids.slice(i, i + BATCH);
    const placeholders = slice.map(() => "?").join(",");
    const sql = `SELECT etablissement_id, description_text, photos_json, menu_prix, video_url, contact_json, card_cover_url, sponsoring, updated_at
                 FROM etablissement_fiches WHERE etablissement_id IN (${placeholders})`;
    try {
      const { results = [] } = await db
        .prepare(sql)
        .bind(...slice)
        .all();
      for (const fr of results as FicheRow[]) {
        map.set(fr.etablissement_id, fr);
      }
    } catch {
      return;
    }
  }
  for (const row of rows) {
    const id = Number(row.id);
    const f = map.get(id);
    if (!f) continue;
    if (ficheRowSponsoring(f)) {
      row.sponsoring = true;
    }
    if (ficheRowHasEditorialContent(f)) {
      row.fiche_enrichie = true;
    }
    if (f.updated_at != null && String(f.updated_at).trim() !== "") {
      row.fiche_editor_updated_at = String(f.updated_at).trim();
    }
    if (f.description_text && String(f.description_text).trim() !== "") {
      row.fiche_description = String(f.description_text).trim();
    }
    if (f.menu_prix && String(f.menu_prix).trim() !== "") {
      row.fiche_menu_prix = String(f.menu_prix).trim();
    }
    if (f.video_url && String(f.video_url).trim() !== "") {
      row.fiche_video_url = String(f.video_url).trim();
    }
    if (f.photos_json) {
      try {
        const p: unknown = JSON.parse(f.photos_json);
        if (Array.isArray(p) && p.length > 0) {
          const urls = p.filter(
            (x): x is string => typeof x === "string" && x.trim() !== ""
          );
          const normalized = normalizePhotoUrlList(urls);
          if (normalized.length > 0) row.fiche_photos = normalized;
        }
      } catch {
        /* ignore */
      }
    }
    if (f.contact_json) {
      try {
        const c: unknown = JSON.parse(f.contact_json);
        if (c && typeof c === "object" && !Array.isArray(c)) {
          row.fiche_contact = c as Record<string, unknown>;
        }
      } catch {
        /* ignore */
      }
    }
    if (f.card_cover_url && String(f.card_cover_url).trim() !== "") {
      const u = normalizePhotoUrl(String(f.card_cover_url).trim());
      if (u) row.fiche_card_cover_url = u;
    }
  }
}

export async function onRequest(context: {
  request: Request;
  env: { DB?: D1Database };
}): Promise<Response> {
  if (context.request.method !== "GET") {
    return new Response(null, { status: 405 });
  }
  const db = context.env.DB;
  if (!db) {
    return Response.json(
      { error: "D1 non configuré (binding DB manquant)." },
      { status: 500 }
    );
  }
  try {
    const { results: michelin = [] } = await db.prepare(MICHELIN_SQL).all();
    const { results: topChefOnly = [] } = await db.prepare(TOP_CHEF_SQL).all();
    const combined = [...michelin, ...topChefOnly] as Record<
      string,
      unknown
    >[];
    await mergeEditorialFiches(db, combined);
    return Response.json(combined, {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=60",
      },
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Erreur D1" },
      { status: 500 }
    );
  }
}
