import { createAdminSession } from "../../../admin/auth";

export async function POST(request: Request) {
  const body = await request.json() as { password?: string };
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || body.password !== expected) {
    return Response.json({ error: "Accès refusé." }, { status: 401 });
  }
  await createAdminSession();
  return Response.json({ ok: true });
}
