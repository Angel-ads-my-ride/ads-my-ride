import { db } from "@/lib/db";
import { getMobileSession, unauthorized } from "@/lib/mobile-auth";

type IncomingPoint = {
  latitude?: unknown;
  longitude?: unknown;
  accuracy?: unknown;
  altitude?: unknown;
  speed?: unknown;
  heading?: unknown;
  recordedAt?: unknown;
};

function haversineMeters(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const radius = 6_371_000;
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = radians(b.latitude - a.latitude);
  const dLon = radians(b.longitude - a.longitude);
  const lat1 = radians(a.latitude);
  const lat2 = radians(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

function optionalNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

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

  const points = (body.points as IncomingPoint[])
    .slice(0, 100)
    .map((point) => ({
      latitude: optionalNumber(point.latitude),
      longitude: optionalNumber(point.longitude),
      accuracy: optionalNumber(point.accuracy),
      altitude: optionalNumber(point.altitude),
      speed: optionalNumber(point.speed),
      heading: optionalNumber(point.heading),
      recordedAt: typeof point.recordedAt === "string" ? new Date(point.recordedAt) : null,
    }))
    .filter((point): point is typeof point & { latitude: number; longitude: number; recordedAt: Date } =>
      point.latitude !== null && point.longitude !== null && point.recordedAt !== null &&
      !Number.isNaN(point.recordedAt.getTime()) && Math.abs(point.latitude) <= 90 &&
      Math.abs(point.longitude) <= 180 && (point.accuracy === null || point.accuracy <= 200)
    )
    .sort((a, b) => a.recordedAt.getTime() - b.recordedAt.getTime());

  if (!points.length) return Response.json({ accepted: 0, distanceMeters: trip.distanceMeters });

  let previous: { latitude: number; longitude: number; recordedAt: Date } | null =
    trip.points[0]
      ? {
          latitude: trip.points[0].latitude,
          longitude: trip.points[0].longitude,
          recordedAt: trip.points[0].recordedAt,
        }
      : null;
  let addedDistance = 0;
  for (const point of points) {
    if (previous) {
      const segment = haversineMeters(previous, point);
      const elapsedSeconds = Math.max(1, (point.recordedAt.getTime() - previous.recordedAt.getTime()) / 1000);
      if (segment <= 2_000 && segment / elapsedSeconds <= 80) addedDistance += segment;
    }
    previous = point;
  }

  const lastPoint = points.at(-1)!;
  // L'adaptateur Neon HTTP ne prend pas en charge les transactions Prisma.
  for (const point of points) {
    await db.locationPoint.create({
      data: { ...point, sessionId: trip.id },
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
