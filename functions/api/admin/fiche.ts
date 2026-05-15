import { isAdminRequest } from "../../lib/adminSession";
import {
  normalizePhotoUrl,
  normalizePhotoUrlList,
  parsePhotoUrlsFromText,
} from "../../lib/normalizePhotoUrl";

type D1Db = {
  prepare: (q: string) => {
    bind: (...args: unknown[]) => {
      first: <T = Record<string, unknown>>() => Promise<T | null>;
      run: () => Promise<unknown>;
    };
  };
};

const MAX_DESC = 80_000;
const MAX_MENU = 40_000;
const MAX_URL = 2048;
const MAX_PHOTOS = 24;

function clampStr(s: unknown, max: number): string | null {
  if (s == null) return null;
  const t = String(s).trim();
  if (t === "") return null;
  return t.length > max ? t.slice(0, max) : t;
}

function normalizePhotos(input: unknown): string | null {
  if (input == null) return null;
  let urls: string[] = [];
  if (Array.isArray(input)) {
    urls = normalizePhotoUrlList(
      input.map((x) => String(x).trim()).filter((u) => u.length > 0)
    );
  } else if (typeof input === "string") {
    urls = parsePhotoUrlsFromText(input);
  } else return null;
  if (urls.length === 0) return null;
  return JSON.stringify(urls.slice(0, MAX_PHOTOS));
}

function normalizeContact(input: unknown): string | null {
  if (input == null) return null;
  if (typeof input !== "object" || input === null) return null;
  const o = input as Record<string, unknown>;
  const out: Record<string, string> = {};
  const keys = [
    "telephone",
    "email",
    "site_web",
    "adresse",
    "ville",
    "chef_nom",
    "nom_restaurant",
  ] as const;
  for (const k of keys) {
    const v = o[k];
    if (v == null) continue;
    const s = String(v).trim();
    if (s === "") continue;
    out[k] = s.length > 500 ? s.slice(0, 500) : s;
  }
  if (Object.keys(out).length === 0) return null;
  return JSON.stringify(out);
}

export async function onRequest(context: {
  request: Request;
  env: { DB?: D1Db; ADMIN_SESSION_SECRET?: string };
}): Promise<Response> {
  const db = context.env.DB;
  if (!db) {
    return Response.json(
      { error: "D1 non configuré (binding DB manquant)." },
      { status: 500 }
    );
  }

  const authed = await isAdminRequest(
    context.request,
    context.env.ADMIN_SESSION_SECRET
  );

  const url = new URL(context.request.url);
  const idParam = url.searchParams.get("id");
  const id = idParam != null ? Number(idParam) : NaN;
  if (!Number.isFinite(id) || id <= 0) {
    return Response.json({ error: "Paramètre id invalide." }, { status: 400 });
  }

  if (context.request.method === "GET") {
    if (!authed) {
      return Response.json({ error: "Non authentifié." }, { status: 401 });
    }
    try {
      const row = await db
        .prepare(
          `SELECT etablissement_id, description_text, photos_json, menu_prix, video_url, contact_json, card_cover_url, sponsoring, updated_at
           FROM etablissement_fiches WHERE etablissement_id = ?`
        )
        .bind(id)
        .first<{
          etablissement_id: number;
          description_text: string | null;
          photos_json: string | null;
          menu_prix: string | null;
          video_url: string | null;
          contact_json: string | null;
          card_cover_url: string | null;
          sponsoring: number | null;
          updated_at: string | null;
        }>();
      if (!row) {
        return Response.json({
          etablissement_id: id,
          description_text: null,
          photos_json: null,
          menu_prix: null,
          video_url: null,
          contact_json: null,
          card_cover_url: null,
          sponsoring: 0,
          updated_at: null,
        });
      }
      return Response.json({
        ...row,
        sponsoring: row.sponsoring === 1 ? 1 : 0,
      });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Erreur lecture fiche éditoriale.";
      if (msg.includes("no such table")) {
        return Response.json(
          {
            error:
              "Table etablissement_fiches absente. Exécutez la migration : data/migration-etablissement-fiches.sql",
          },
          { status: 500 }
        );
      }
      if (msg.includes("no such column") && msg.includes("card_cover_url")) {
        return Response.json(
          {
            error:
              "Colonne card_cover_url absente. Exécutez : data/migration-fiche-card-cover-url.sql",
          },
          { status: 500 }
        );
      }
      if (msg.includes("no such column") && msg.includes("sponsoring")) {
        return Response.json(
          {
            error:
              "Colonne sponsoring absente. Exécutez : data/migration-fiche-sponsoring.sql",
          },
          { status: 500 }
        );
      }
      return Response.json({ error: msg }, { status: 500 });
    }
  }

  if (context.request.method === "PUT") {
    if (!authed) {
      return Response.json({ error: "Non authentifié." }, { status: 401 });
    }
    let body: Record<string, unknown>;
    try {
      body = (await context.request.json()) as Record<string, unknown>;
    } catch {
      return Response.json({ error: "Corps JSON invalide." }, { status: 400 });
    }
    const bodyId = Number(body.etablissement_id ?? body.id);
    if (!Number.isFinite(bodyId) || bodyId !== id) {
      return Response.json(
        { error: "etablissement_id incohérent avec l’URL." },
        { status: 400 }
      );
    }

    const description_text = clampStr(body.description_text, MAX_DESC);
    const photos_json = normalizePhotos(body.photos_json ?? body.photos);
    const menu_prix = clampStr(body.menu_prix, MAX_MENU);
    const video_url = clampStr(body.video_url, MAX_URL);
    const contact_json = normalizeContact(body.contact_json ?? body.contact);
    const card_cover_raw = clampStr(body.card_cover_url, MAX_URL);
    const card_cover_url = card_cover_raw
      ? normalizePhotoUrl(card_cover_raw)
      : null;
    const sponsoring =
      body.sponsoring === true ||
      body.sponsoring === 1 ||
      body.sponsoring === "1"
        ? 1
        : 0;

    try {
      await db
        .prepare(
          `INSERT INTO etablissement_fiches (etablissement_id, description_text, photos_json, menu_prix, video_url, contact_json, card_cover_url, sponsoring, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
           ON CONFLICT(etablissement_id) DO UPDATE SET
             description_text = excluded.description_text,
             photos_json = excluded.photos_json,
             menu_prix = excluded.menu_prix,
             video_url = excluded.video_url,
             contact_json = excluded.contact_json,
             card_cover_url = excluded.card_cover_url,
             sponsoring = excluded.sponsoring,
             updated_at = excluded.updated_at`
        )
        .bind(
          id,
          description_text,
          photos_json,
          menu_prix,
          video_url,
          contact_json,
          card_cover_url,
          sponsoring
        )
        .run();
      return Response.json({ ok: true });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Erreur enregistrement fiche.";
      if (msg.includes("no such table")) {
        return Response.json(
          {
            error:
              "Table etablissement_fiches absente. Exécutez la migration : data/migration-etablissement-fiches.sql",
          },
          { status: 500 }
        );
      }
      if (msg.includes("no such column") && msg.includes("card_cover_url")) {
        return Response.json(
          {
            error:
              "Colonne card_cover_url absente. Exécutez : data/migration-fiche-card-cover-url.sql",
          },
          { status: 500 }
        );
      }
      if (msg.includes("no such column") && msg.includes("sponsoring")) {
        return Response.json(
          {
            error:
              "Colonne sponsoring absente. Exécutez : data/migration-fiche-sponsoring.sql",
          },
          { status: 500 }
        );
      }
      return Response.json({ error: msg }, { status: 500 });
    }
  }

  return new Response(null, { status: 405 });
}
