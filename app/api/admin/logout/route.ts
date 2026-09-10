import { clearAdminSession } from "../../../admin/auth";

export async function POST(request: Request) {
  await clearAdminSession();
  return Response.redirect(new URL("/", request.url), 303);
}
