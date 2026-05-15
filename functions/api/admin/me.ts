import { isAdminRequest } from "../../lib/adminSession";

export async function onRequest(context: {
  request: Request;
  env: { ADMIN_SESSION_SECRET?: string };
}): Promise<Response> {
  if (context.request.method !== "GET") {
    return new Response(null, { status: 405 });
  }
  const ok = await isAdminRequest(
    context.request,
    context.env.ADMIN_SESSION_SECRET
  );
  if (!ok) {
    return Response.json({ authenticated: false }, { status: 401 });
  }
  return Response.json({ authenticated: true });
}
