import { db } from "@/lib/db";
import { getMobileSession, unauthorized } from "@/lib/mobile-auth";
import { calculateAddedDistance, normalizeLocationPoints, type IncomingLocationPoint } from "@/lib/tracking-distance";

export async function POST(request: Request) {
  const auth = await getMobileSession(request);
  if (!auth) return unauthorized();
  const body = (await request.json().catch(() => null)) as {
    sessionId?: unknown;
    points?: unknown;
    rssi?: unknown;
  } | null;
  if (typeof body?.sessionId !== "string" || !Array.isArray(body.points)) {
    return Response.json({ error: "Lot de positions invalide." }, { status: 400 });
  }

  const trip = await db.trackingSession.findFirst({
    where: { id: body.sessionId, userId: auth.userId, status: "ACTIVE" },
    include: { points: { orderBy: { recordedAt: "desc" }, take: 1 } },
  });
  if (!trip) return Response.json({ error: "Trajet actif introuvable." }, { status: 404 });

  let points = normalizeLocationPoints(body.points as IncomingLocationPoint[]);

  if (!points.length) return Response.json({ accepted: 0, distanceMeters: trip.distanceMeters });

  const existingPoints = await db.locationPoint.findMany({
    where: { sessionId: trip.id, recordedAt: { in: points.map((point) => point.recordedAt) } },
    select: { recordedAt: true },
  });
  const existingTimes = new Set(existingPoints.map((point) => point.recordedAt.getTime()));
  points = points.filter((point) => !existingTimes.has(point.recordedAt.getTime()));
  if (!points.length) return Response.json({ accepted: 0, distanceMeters: trip.distanceMeters });

  const previous: { latitude: number; longitude: number; recordedAt: Date } | null =
    trip.points[0]
      ? {
          latitude: trip.points[0].latitude,
          longitude: trip.points[0].longitude,
          recordedAt: trip.points[0].recordedAt,
        }
      : null;
  const addedDistance = calculateAddedDistance(previous, points);

  const lastPoint = points.at(-1)!;
  // L'adaptateur Neon HTTP ne prend pas en charge les transactions Prisma.
  for (const point of points) {
    const { startsNewSegment: _startsNewSegment, ...storedPoint } = point;
    await db.locationPoint.upsert({
      where: { sessionId_recordedAt: { sessionId: trip.id, recordedAt: point.recordedAt } },
      update: {},
      create: { ...storedPoint, sessionId: trip.id },
    });
  }
  await db.trackingSession.update({
    where: { id: trip.id },
    data: { distanceMeters: { increment: addedDistance }, lastPointAt: lastPoint.recordedAt },
  });
  await db.beaconDevice.update({
    where: { id: trip.beaconDeviceId },
    data: {
      lastSeenAt: new Date(),
      lastRssi: typeof body.rssi === "number" ? Math.round(body.rssi) : undefined,
    },
  });

  return Response.json({ accepted: points.length, distanceMeters: trip.distanceMeters + addedDistance });
}
