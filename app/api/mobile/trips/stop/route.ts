import { db } from "@/lib/db";
import { getMobileSession, unauthorized } from "@/lib/mobile-auth";

export async function POST(request: Request) {
  const auth = await getMobileSession(request);
  if (!auth) return unauthorized();
  const body = (await request.json().catch(() => null)) as { sessionId?: unknown } | null;
  if (typeof body?.sessionId !== "string") {
    return Response.json({ error: "Trajet requis." }, { status: 400 });
  }

  const trip = await db.trackingSession.findFirst({
    where: { id: body.sessionId, userId: auth.userId, status: "ACTIVE" },
    select: { id: true },
  });
  if (!trip) return Response.json({ error: "Trajet actif introuvable." }, { status: 404 });
  await db.trackingSession.update({
    where: { id: trip.id },
    data: { status: "COMPLETED", endedAt: new Date() },
  });
  return Response.json({ success: true });
}
