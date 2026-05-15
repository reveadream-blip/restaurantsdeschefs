import { parsePartenariatSettingsJson } from "../lib/partnerSettings";

type D1Db = {
  prepare: (q: string) => {
    bind: (...args: unknown[]) => {
      first: <T = Record<string, unknown>>() => Promise<T | null>;
    };
  };
};

export async function onRequest(context: {
  request: Request;
  env: { DB?: D1Db };
}): Promise<Response> {
  if (context.request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const defaults = parsePartenariatSettingsJson(null);
  const db = context.env.DB;
  if (!db) {
    return Response.json(defaults);
  }

  try {
    const row = await db
      .prepare(
        `SELECT value_json FROM site_settings WHERE key = 'partner_banner' LIMIT 1`
      )
      .first<{ value_json: string }>();
    return Response.json(parsePartenariatSettingsJson(row?.value_json));
  } catch {
    return Response.json(defaults);
  }
}
