import { db } from "@/lib/db";
import { getMobileSession, unauthorized } from "@/lib/mobile-auth";

export async function POST(request: Request) {
  const auth = await getMobileSession(request);
  if (!auth) return unauthorized();
  const body = (await request.json().catch(() => ({}))) as { bookingId?: unknown; rssi?: unknown };
  const bookingId = typeof body.bookingId === "string" ? body.bookingId : null;

  const beacon = await db.beaconDevice.findUnique({ where: { userId: auth.userId } });
  if (!beacon?.isActive) {
    return Response.json({ error: "Associez et activez d’abord votre balise." }, { status: 409 });
  }

  if (bookingId) {
    const booking = await db.booking.findFirst({
      where: { id: bookingId, userId: auth.userId, status: "CONFIRMED" },
      select: { id: true },
    });
    if (!booking) return Response.json({ error: "Campagne non disponible." }, { status: 404 });
  }

  const alreadyActive = await db.trackingSession.findFirst({
    where: { userId: auth.userId, status: "ACTIVE" },
  });
  if (alreadyActive) return Response.json({ trip: alreadyActive });

  // L'adaptateur Neon HTTP ne prend pas en charge les transactions Prisma.
  const trip = await db.trackingSession.create({
    data: { userId: auth.userId, beaconDeviceId: beacon.id, bookingId },
  });
  await db.beaconDevice.update({
    where: { id: beacon.id },
    data: {
      lastSeenAt: new Date(),
      lastRssi: typeof body.rssi === "number" ? Math.round(body.rssi) : undefined,
    },
  });
  if (bookingId) {
    await db.booking.update({
      where: { id: bookingId },
      data: { startedAt: new Date() },
    });
  }

  return Response.json({ trip }, { status: 201 });
}
