import { db } from "@/lib/db";
import { getMobileSession, unauthorized } from "@/lib/mobile-auth";

export async function POST(request: Request) {
  const session = await getMobileSession(request);
  if (!session) return unauthorized();

  const body = (await request.json().catch(() => null)) as {
    serial?: unknown;
    name?: unknown;
    serviceUuid?: unknown;
    beaconUuid?: unknown;
    major?: unknown;
    minor?: unknown;
    rssi?: unknown;
  } | null;
  const serial = typeof body?.serial === "string" ? body.serial.trim().slice(0, 180) : "";
  if (!serial) return Response.json({ error: "Identifiant de balise requis." }, { status: 400 });

  const claimed = await db.beaconDevice.findUnique({ where: { serial }, select: { userId: true } });
  if (claimed && claimed.userId !== session.userId) {
    return Response.json({ error: "Cette balise est déjà associée à un autre compte." }, { status: 409 });
  }

  const asOptionalString = (value: unknown) =>
    typeof value === "string" && value.trim() ? value.trim().slice(0, 180) : null;
  const asOptionalInt = (value: unknown) =>
    typeof value === "number" && Number.isInteger(value) ? value : null;

  const beacon = await db.beaconDevice.upsert({
    where: { userId: session.userId },
    create: {
      userId: session.userId,
      serial,
      name: asOptionalString(body?.name) ?? "HCBB07-KA",
      serviceUuid: asOptionalString(body?.serviceUuid),
      beaconUuid: asOptionalString(body?.beaconUuid),
      major: asOptionalInt(body?.major),
      minor: asOptionalInt(body?.minor),
      lastRssi: asOptionalInt(body?.rssi),
      lastSeenAt: new Date(),
    },
    update: {
      serial,
      name: asOptionalString(body?.name) ?? "HCBB07-KA",
      serviceUuid: asOptionalString(body?.serviceUuid),
      beaconUuid: asOptionalString(body?.beaconUuid),
      major: asOptionalInt(body?.major),
      minor: asOptionalInt(body?.minor),
      lastRssi: asOptionalInt(body?.rssi),
      lastSeenAt: new Date(),
      activatedAt: new Date(),
      isActive: true,
    },
  });

  return Response.json({ beacon });
}
