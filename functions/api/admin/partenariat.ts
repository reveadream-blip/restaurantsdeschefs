import { isAdminRequest } from "../../lib/adminSession";
import { parsePartnerBannerJson } from "../../lib/partnerBanner";

type D1Db = {
  prepare: (q: string) => {
    bind: (...args: unknown[]) => {
      first: <T = Record<string, unknown>>() => Promise<T | null>;
      run: () => Promise<unknown>;
    };
  };
};

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

  if (context.request.method === "GET") {
    if (!authed) {
      return Response.json({ error: "Non authentifié." }, { status: 401 });
    }
    try {
      const row = await db
        .prepare(
          `SELECT value_json, updated_at FROM site_settings WHERE key = 'partner_banner' LIMIT 1`
        )
        .first<{ value_json: string; updated_at: string | null }>();
      return Response.json({
        banner: parsePartnerBannerJson(row?.value_json),
        updated_at: row?.updated_at ?? null,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur lecture.";
      if (msg.includes("no such table")) {
        return Response.json(
          {
            error:
              "Table site_settings absente. Exécutez : data/migration-abonnement-partenaire.sql",
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
    const banner = parsePartnerBannerJson(
      JSON.stringify(body.banner ?? body)
    );
    try {
      await db
        .prepare(
          `INSERT INTO site_settings (key, value_json, updated_at)
           VALUES ('partner_banner', ?, datetime('now'))
           ON CONFLICT(key) DO UPDATE SET
             value_json = excluded.value_json,
             updated_at = excluded.updated_at`
        )
        .bind(JSON.stringify(banner))
        .run();
      return Response.json({ ok: true, banner });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur enregistrement.";
      if (msg.includes("no such table")) {
        return Response.json(
          {
            error:
              "Table site_settings absente. Exécutez : data/migration-abonnement-partenaire.sql",
          },
          { status: 500 }
        );
      }
      return Response.json({ error: msg }, { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}
