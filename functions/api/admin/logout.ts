import { adminClearCookieHeader } from "../../lib/adminSession";

export async function onRequest(context: {
  request: Request;
}): Promise<Response> {
  if (context.request.method !== "POST") {
    return new Response(null, { status: 405 });
  }
  return Response.json(
    { ok: true },
    {
      headers: {
        "set-cookie": adminClearCookieHeader(),
      },
    }
  );
}
