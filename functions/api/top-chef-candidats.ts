/**
 * GET /api/top-chef-candidats — noms + saisons (table top_chef_candidats).
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
        `SELECT id, nom_complet, saisons_json
         FROM top_chef_candidats
         ORDER BY nom_complet COLLATE NOCASE`
      )
      .all();
    return Response.json(results ?? [], {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Erreur D1" },
      { status: 500 }
    );
  }
}
