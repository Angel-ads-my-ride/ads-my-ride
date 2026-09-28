import "server-only";

import { db } from "@/lib/db";

export type AdminTrackingPoint = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  recordedAt: string;
};

export type AdminTrackingSession = {
  id: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  lastPointAt: string | null;
  distanceMeters: number;
  driver: {
    name: string;
    email: string;
    carBrand: string | null;
    carModel: string | null;
  };
  beacon: {
    name: string;
    serial: string;
    isActive: boolean;
    lastSeenAt: string | null;
    lastRssi: number | null;
  };
  campaignTitle: string | null;
  points: AdminTrackingPoint[];
};

export async function getAdminTrackingSessions(): Promise<AdminTrackingSession[]> {
  const sessions = await db.trackingSession.findMany({
    where: { points: { some: {} } },
    orderBy: { startedAt: "desc" },
    take: 25,
    select: {
      id: true,
      status: true,
      startedAt: true,
      endedAt: true,
      lastPointAt: true,
      distanceMeters: true,
      user: {
        select: {
          name: true,
          email: true,
          carBrand: true,
          carModel: true,
        },
      },
      beaconDevice: {
        select: {
          name: true,
          serial: true,
          isActive: true,
          lastSeenAt: true,
          lastRssi: true,
        },
      },
      booking: { select: { ad: { select: { title: true } } } },
      points: {
        orderBy: { recordedAt: "desc" },
        take: 500,
        select: {
          latitude: true,
          longitude: true,
          accuracy: true,
          speed: true,
          recordedAt: true,
        },
      },
    },
  });

  return sessions
    .map((session) => ({
      id: session.id,
      status: session.status,
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt?.toISOString() ?? null,
      lastPointAt: session.lastPointAt?.toISOString() ?? null,
      distanceMeters: session.distanceMeters,
      driver: session.user,
      beacon: {
        ...session.beaconDevice,
        lastSeenAt: session.beaconDevice.lastSeenAt?.toISOString() ?? null,
      },
      campaignTitle: session.booking?.ad.title ?? null,
      points: session.points.reverse().map((point) => ({
        ...point,
        recordedAt: point.recordedAt.toISOString(),
      })),
    }))
    .sort((a, b) => Number(b.status === "ACTIVE") - Number(a.status === "ACTIVE"));
}
