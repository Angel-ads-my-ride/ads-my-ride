import { db } from "@/lib/db";
import { getMobileSession, getTrackingSession, unauthorized } from "@/lib/mobile-auth";
import { calculateAddedDistance, normalizeLocationPoints, type IncomingLocationPoint } from "@/lib/tracking-distance";

export async function POST(request: Request) {
  const accountAuth = await getMobileSession(request);
  const trackingAuth = accountAuth ? null : await getTrackingSession(request);
  if (!accountAuth && !trackingAuth) return unauthorized();
  const body = (await request.json().catch(() => null)) as {
    sessionId?: unknown;
    points?: unknown;
    rssi?: unknown;
  } | null;
  if (typeof body?.sessionId !== "string" || !Array.isArray(body.points)) {
    return Response.json({ error: "Lot de positions invalide." }, { status: 400 });
  }
  if (trackingAuth && trackingAuth.sessionId !== body.sessionId) return unauthorized();

  const userId = accountAuth?.userId ?? trackingAuth!.userId;

  const trip = await db.trackingSession.findFirst({
    where: { id: body.sessionId, userId, status: "ACTIVE" },
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
  // `upsert` et `createMany` ouvrent une transaction interne avec Prisma 7,
  // ce que l'adaptateur Neon HTTP ne prend pas en charge. Les doublons ont
  // déjà été filtrés ci-dessus ; une collision concurrente est ignorée.
  for (const point of points) {
    const storedPoint = {
      latitude: point.latitude,
      longitude: point.longitude,
      accuracy: point.accuracy,
      altitude: point.altitude,
      speed: point.speed,
      heading: point.heading,
      recordedAt: point.recordedAt,
    };
    try {
      await db.locationPoint.create({ data: { ...storedPoint, sessionId: trip.id } });
    } catch (error) {
      if (!(error && typeof error === "object" && "code" in error && error.code === "P2002")) throw error;
    }
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
