/**
 * GET /api/etablissements — liste des restaurants (tél / mail = établissement uniquement).
 * Liaison D1 : binding `DB` (voir wrangler.toml + dashboard Pages).
 */
type D1Result<T = Record<string, unknown>> = { results?: T[] };

export async function onRequest(context: {
  request: Request;
  env: { DB?: { prepare: (q: string) => { all: () => Promise<D1Result> } } };
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
    const { results } = await db
      .prepare(
        `SELECT e.id,
                e.nom_restaurant,
                e.etoiles_michelin,
                e.ville,
                e.latitude,
                e.longitude,
                e.telephone,
                e.email,
                c.nom AS chef_nom,
                CASE WHEN c.top_chef_saison IS NOT NULL THEN 1 ELSE 0 END AS top_chef
         FROM etablissements e
         LEFT JOIN chefs c ON c.id = e.chef_id
         WHERE e.latitude IS NOT NULL AND e.longitude IS NOT NULL`
      )
      .all();
    return Response.json(results ?? [], {
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
