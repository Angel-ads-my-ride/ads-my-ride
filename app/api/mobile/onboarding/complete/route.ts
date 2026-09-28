import { db } from "@/lib/db";
import { getMobileSession, unauthorized } from "@/lib/mobile-auth";

export async function POST(request: Request) {
  const session = await getMobileSession(request);
  if (!session) return unauthorized();

  const beacon = await db.beaconDevice.findFirst({
    where: { userId: session.userId, isActive: true },
    select: { id: true },
  });
  if (!beacon) {
    return Response.json(
      { error: "Associez et activez votre balise avant de terminer la configuration." },
      { status: 409 },
    );
  }

  const user = await db.user.update({
    where: { id: session.userId },
    data: { mobileOnboardingCompletedAt: new Date() },
    select: { mobileOnboardingCompletedAt: true },
  });

  return Response.json({ completedAt: user.mobileOnboardingCompletedAt });
}
