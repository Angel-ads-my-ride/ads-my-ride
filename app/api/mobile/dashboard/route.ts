import { db } from "@/lib/db";
import { getMobileSession, unauthorized } from "@/lib/mobile-auth";

export async function GET(request: Request) {
  const session = await getMobileSession(request);
  if (!session) return unauthorized();

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      carBrand: true,
      carModel: true,
      earnings: true,
      mobileOnboardingCompletedAt: true,
      beaconDevice: true,
      bookings: {
        where: { status: "CONFIRMED" },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          status: true,
          startedAt: true,
          ad: { select: { title: true, imageUrl: true, pricePerDay: true } },
        },
      },
      trackingSessions: {
        orderBy: { startedAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          startedAt: true,
          endedAt: true,
          lastPointAt: true,
          distanceMeters: true,
          booking: { select: { ad: { select: { title: true } } } },
        },
      },
    },
  });
  if (!user) return unauthorized();

  const activeSession = user.trackingSessions.find((trip) => trip.status === "ACTIVE") ?? null;
  return Response.json({ user, activeSession });
}
