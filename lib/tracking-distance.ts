export type IncomingLocationPoint = {
  latitude?: unknown;
  longitude?: unknown;
  accuracy?: unknown;
  altitude?: unknown;
  speed?: unknown;
  heading?: unknown;
  recordedAt?: unknown;
  startsNewSegment?: unknown;
};

export type ValidLocationPoint = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  recordedAt: Date;
  startsNewSegment: boolean;
};

type DistancePoint = Pick<ValidLocationPoint, "latitude" | "longitude" | "recordedAt">;

function optionalNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function haversineMeters(a: DistancePoint, b: DistancePoint) {
  const radius = 6_371_000;
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = radians(b.latitude - a.latitude);
  const dLon = radians(b.longitude - a.longitude);
  const lat1 = radians(a.latitude);
  const lat2 = radians(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

export function normalizeLocationPoints(incoming: IncomingLocationPoint[]) {
  const points = incoming
    .slice(0, 100)
    .map((point) => ({
      latitude: optionalNumber(point.latitude),
      longitude: optionalNumber(point.longitude),
      accuracy: optionalNumber(point.accuracy),
      altitude: optionalNumber(point.altitude),
      speed: optionalNumber(point.speed),
      heading: optionalNumber(point.heading),
      recordedAt: typeof point.recordedAt === "string" ? new Date(point.recordedAt) : null,
      startsNewSegment: point.startsNewSegment === true,
    }))
    .filter((point): point is ValidLocationPoint =>
      point.latitude !== null && point.longitude !== null && point.recordedAt !== null &&
      !Number.isNaN(point.recordedAt.getTime()) && Math.abs(point.latitude) <= 90 &&
      Math.abs(point.longitude) <= 180 && (point.accuracy === null || point.accuracy <= 200)
    )
    .sort((a, b) => a.recordedAt.getTime() - b.recordedAt.getTime());

  return [...new Map(points.map((point) => [point.recordedAt.getTime(), point])).values()];
}

export function calculateAddedDistance(previous: DistancePoint | null, points: DistancePoint[]) {
  let addedDistance = 0;
  let anchor = previous;
  for (const point of points) {
    if ("startsNewSegment" in point && point.startsNewSegment === true) {
      anchor = point;
      continue;
    }
    if (anchor) {
      const segment = haversineMeters(anchor, point);
      const elapsedSeconds = Math.max(1, (point.recordedAt.getTime() - anchor.recordedAt.getTime()) / 1000);
      if (segment <= 2_000 && segment / elapsedSeconds <= 80) addedDistance += segment;
    }
    anchor = point;
  }
  return addedDistance;
}
