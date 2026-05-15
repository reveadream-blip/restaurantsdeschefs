import {
  buildContactJsonFromExtract,
  buildDescriptionFromExtract,
  fetchAndExtractSite,
} from "../../lib/extractSiteInfo";
import { isAdminRequest } from "../../lib/adminSession";
import { UnsafeUrlError } from "../../lib/ssrfSafeUrl";

type D1Db = {
  prepare: (q: string) => {
    bind: (...args: unknown[]) => {
      first: <T = Record<string, unknown>>() => Promise<T | null>;
      run: () => Promise<unknown>;
    };
  };
};

async function resolveSiteUrl(db: D1Db, etablissementId: number): Promise<string | null> {
  if (etablissementId >= 800000000) {
    const rid = etablissementId - 800000000;
    const row = await db
      .prepare(
        `SELECT TRIM(COALESCE(site_web, '')) AS u FROM top_chef_restaurants WHERE id = ?`
      )
      .bind(rid)
      .first<{ u: string }>();
    const u = row?.u?.trim();
    return u && u.length > 0 ? u : null;
  }
  const row = await db
    .prepare(
      `SELECT TRIM(COALESCE(site_web, '')) AS u FROM etablissements WHERE id = ?`
    )
    .bind(etablissementId)
    .first<{ u: string }>();
  const u = row?.u?.trim();
  return u && u.length > 0 ? u : null;
}

function mergeUniquePhotos(
  existingJson: string | null,
  incoming: string[]
): string | null {
  const set = new Set<string>();
  if (existingJson) {
    try {
      const p: unknown = JSON.parse(existingJson);
      if (Array.isArray(p)) {
        for (const x of p) {
          if (typeof x === "string" && /^https?:\/\//i.test(x)) set.add(x);
        }
      }
    } catch {
      /* */
    }
  }
  for (const x of incoming) {
    if (/^https?:\/\//i.test(x)) set.add(x);
  }
  const arr = [...set].slice(0, 24);
  return arr.length ? JSON.stringify(arr) : null;
}

function mergeContactJson(
  existingJson: string | null,
  incoming: Record<string, string> | null
): string | null {
  const base: Record<string, string> = {};
  if (existingJson) {
    try {
      const o = JSON.parse(existingJson) as Record<string, unknown>;
      for (const [k, v] of Object.entries(o)) {
        if (typeof v === "string" && v.trim()) base[k] = v.trim();
      }
    } catch {
      /* */
    }
  }
  if (incoming) {
    for (const [k, v] of Object.entries(incoming)) {
      if (v.trim()) base[k] = v.trim();
    }
  }
  return Object.keys(base).length ? JSON.stringify(base) : null;
}

export async function onRequest(context: {
  request: Request;
  env: { DB?: D1Db; ADMIN_SESSION_SECRET?: string };
}): Promise<Response> {
  if (context.request.method !== "POST") {
    return new Response(null, { status: 405 });
  }
  const authed = await isAdminRequest(
    context.request,
    context.env.ADMIN_SESSION_SECRET
  );
  if (!authed) {
    return Response.json({ error: "Non authentifié." }, { status: 401 });
  }
  const db = context.env.DB;
  if (!db) {
    return Response.json(
      { error: "D1 non configuré (binding DB manquant)." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await context.request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const id = Number(body.etablissement_id ?? body.id);
  let urlStr = String(body.url ?? "").trim();
  const apply = Boolean(body.apply);

  if (!urlStr && Number.isFinite(id) && id > 0) {
    try {
      urlStr = (await resolveSiteUrl(db, id)) ?? "";
    } catch {
      urlStr = "";
    }
  }

  if (!urlStr) {
    return Response.json(
      {
        error:
          "URL manquante : indiquez « url » ou un « etablissement_id » avec site web en base.",
      },
      { status: 400 }
    );
  }

  let extracted;
  try {
    extracted = await fetchAndExtractSite(urlStr);
  } catch (e) {
    const msg =
      e instanceof UnsafeUrlError
        ? e.message
        : e instanceof Error
          ? e.message
          : "Échec de lecture du site.";
    return Response.json({ error: msg }, { status: 400 });
  }

  if (!apply) {
    return Response.json({ preview: extracted });
  }

  if (!Number.isFinite(id) || id <= 0) {
    return Response.json(
      { error: "etablissement_id requis pour enregistrer." },
      { status: 400 }
    );
  }

  const description_text = buildDescriptionFromExtract(extracted);
  const contactNew = buildContactJsonFromExtract(extracted);

  try {
    const existing = await db
      .prepare(
        `SELECT photos_json, contact_json FROM etablissement_fiches WHERE etablissement_id = ?`
      )
      .bind(id)
      .first<{ photos_json: string | null; contact_json: string | null }>();

    const photos_json = mergeUniquePhotos(
      existing?.photos_json ?? null,
      extracted.images
    );
    const contact_json = mergeContactJson(
      existing?.contact_json ?? null,
      contactNew
    );

    await db
      .prepare(
        `INSERT INTO etablissement_fiches (etablissement_id, description_text, photos_json, menu_prix, video_url, contact_json, updated_at)
         VALUES (?, ?, ?, NULL, NULL, ?, datetime('now'))
         ON CONFLICT(etablissement_id) DO UPDATE SET
           description_text = excluded.description_text,
           photos_json = COALESCE(excluded.photos_json, etablissement_fiches.photos_json),
           menu_prix = COALESCE(etablissement_fiches.menu_prix, excluded.menu_prix),
           video_url = COALESCE(etablissement_fiches.video_url, excluded.video_url),
           contact_json = excluded.contact_json,
           updated_at = excluded.updated_at`
      )
      .bind(
        id,
        description_text.slice(0, 80_000),
        photos_json,
        contact_json
      )
      .run();
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Erreur enregistrement après import.";
    if (msg.includes("no such table")) {
      return Response.json(
        {
          error:
            "Table etablissement_fiches absente. Exécutez data/migration-etablissement-fiches.sql",
        },
        { status: 500 }
      );
    }
    return Response.json({ error: msg }, { status: 500 });
  }

  return Response.json({ ok: true, preview: extracted });
}
