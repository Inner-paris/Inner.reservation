import { and, count, eq, ne, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { reservations, sessionHolds } from "../../../../db/schema";
import { isAdmin } from "../../../admin/auth";

const sessions = [
  { id: "2026-10-10-10", label: "Samedi 10 octobre · 10:00" },
  { id: "2026-10-10-12", label: "Samedi 10 octobre · 12:00" },
  { id: "2026-10-11-10", label: "Dimanche 11 octobre · 10:00" },
  { id: "2026-10-11-12", label: "Dimanche 11 octobre · 12:00" },
];

async function getSessions() {
  const db = getDb();
  return Promise.all(sessions.map(async (session) => {
    const [booking] = await db.select({ total: count() }).from(reservations).where(and(eq(reservations.sessionId, session.id), ne(reservations.status, "cancelled")));
    const [hold] = await db.select({ heldCount: sessionHolds.heldCount }).from(sessionHolds).where(eq(sessionHolds.sessionId, session.id));
    const booked = Number(booking?.total ?? 0);
    const held = Number(hold?.heldCount ?? 0);
    return { ...session, booked, held, remaining: Math.max(0, 10 - booked - held) };
  }));
}

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Accès refusé." }, { status: 403 });
  return Response.json({ sessions: await getSessions() });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Accès refusé." }, { status: 403 });
  const body = await request.json() as { sessionId?: string; held?: number };
  const session = sessions.find((item) => item.id === body.sessionId);
  const held = Number(body.held);
  if (!session || !Number.isInteger(held) || held < 0 || held > 10) return Response.json({ error: "Valeur incorrecte." }, { status: 400 });

  const db = getDb();
  const [booking] = await db.select({ total: count() }).from(reservations).where(and(eq(reservations.sessionId, session.id), ne(reservations.status, "cancelled")));
  if (held + Number(booking?.total ?? 0) > 10) return Response.json({ error: "Il n’y a pas assez de places disponibles." }, { status: 409 });

  await db.insert(sessionHolds).values({ sessionId: session.id, heldCount: held })
    .onConflictDoUpdate({ target: sessionHolds.sessionId, set: { heldCount: held, updatedAt: sql`CURRENT_TIMESTAMP` } });
  return Response.json({ sessions: await getSessions() });
}
