import { parsePartnerBannerJson } from "../lib/partnerBanner";

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

  const db = context.env.DB;
  if (!db) {
    return Response.json({
      banner: parsePartnerBannerJson(null),
    });
  }

  try {
    const row = await db
      .prepare(
        `SELECT value_json FROM site_settings WHERE key = 'partner_banner' LIMIT 1`
      )
      .first<{ value_json: string }>();
    return Response.json({
      banner: parsePartnerBannerJson(row?.value_json),
    });
  } catch {
    return Response.json({
      banner: parsePartnerBannerJson(null),
    });
  }
}
