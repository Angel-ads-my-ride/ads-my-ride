import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL manquante.");

const db = new PrismaClient({
  adapter: new PrismaNeonHttp(process.env.DATABASE_URL, {
    arrayMode: false,
    fullResults: false,
  }),
});

const TEST_EMAIL = "conducteur.test@adsmyride.com";
const TEST_PASSWORD = "TestAdsMyRide2026!";
const DEMO_TRACKER_EMAIL = "vehicule.demo@adsmyride.com";
const ADVERTISER_EMAIL = "demo.annonceur@adsmyride.com";

function haversineMeters(a, b) {
  const radius = 6_371_000;
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const dLat = radians(b.latitude - a.latitude);
  const dLon = radians(b.longitude - a.longitude);
  const lat1 = radians(a.latitude);
  const lat2 = radians(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

async function ensureBooking(userId, adId) {
  const existing = await db.booking.findFirst({ where: { userId, adId } });
  if (existing) {
    return db.booking.update({
      where: { id: existing.id },
      data: { status: "CONFIRMED", scheduledAt: new Date() },
    });
  }
  return db.booking.create({
    data: { userId, adId, status: "CONFIRMED", scheduledAt: new Date() },
  });
}

async function ensureUser(email, createData, updateData) {
  const existing = await db.user.findUnique({ where: { email } });
  return existing
    ? db.user.update({ where: { id: existing.id }, data: updateData })
    : db.user.create({ data: { email, ...createData } });
}

async function main() {
  const password = await bcrypt.hash(TEST_PASSWORD, 10);
  console.log("[1/7] Compte annonceur");
  const advertiser = await ensureUser(
    ADVERTISER_EMAIL,
    {
      name: "Annonceur Démo",
      password,
      role: "ADVERTISER",
      isCertified: true,
      companyName: "Ads My Ride Démo",
      siret: "00000000000000",
    },
    { role: "ADVERTISER", isCertified: true },
  );

  console.log("[2/7] Campagne test");
  let ad = await db.ad.findFirst({
    where: { advertiserId: advertiser.id, title: "Campagne test — Ads My Ride" },
  });
  const adData = {
    title: "Campagne test — Ads My Ride",
    description: "Campagne de démonstration pour valider le covering, le tracker et le suivi GPS.",
    pricePerDay: 35,
    totalBudget: 5_000,
    remainingBudget: 5_000,
    isActive: true,
    status: "APPROVED",
    autoAccept: true,
    maxApplicants: 10,
    countries: ["France"],
    departments: ["75", "92", "93", "94"],
    vehicleConditions: ["Bon état"],
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1_000),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1_000),
  };
  ad = ad
    ? await db.ad.update({ where: { id: ad.id }, data: adData })
    : await db.ad.create({ data: { ...adData, advertiserId: advertiser.id } });

  console.log("[3/7] Compte conducteur test");
  const testDriver = await ensureUser(
    TEST_EMAIL,
    {
      name: "Camille Conducteur",
      password,
      role: "CUSTOMER",
      carBrand: "Renault",
      carModel: "Clio V",
      phone: "0600000000",
      address: "Paris",
      mobileOnboardingCompletedAt: new Date(),
    },
    {
      name: "Camille Conducteur",
      password,
      role: "CUSTOMER",
      carBrand: "Renault",
      carModel: "Clio V",
      mobileOnboardingCompletedAt: new Date(),
    },
  );
  console.log("[4/7] Candidature test");
  await ensureBooking(testDriver.id, ad.id);

  console.log("[5/7] Véhicule de démonstration");
  const demoDriver = await ensureUser(
    DEMO_TRACKER_EMAIL,
    {
      name: "Véhicule Démo Paris",
      password,
      role: "CUSTOMER",
      carBrand: "Peugeot",
      carModel: "208",
      mobileOnboardingCompletedAt: new Date(),
    },
    {
      name: "Véhicule Démo Paris",
      password,
      role: "CUSTOMER",
      carBrand: "Peugeot",
      carModel: "208",
    },
  );
  const demoBooking = await ensureBooking(demoDriver.id, ad.id);
  const existingBeacon = await db.beaconDevice.findUnique({ where: { userId: demoDriver.id } });
  const beacon = existingBeacon
    ? await db.beaconDevice.update({
        where: { id: existingBeacon.id },
        data: { isActive: true, lastRssi: -57, lastSeenAt: new Date() },
      })
    : await db.beaconDevice.create({
        data: {
          userId: demoDriver.id,
          serial: "AD5A1DE0-7BEE-4A11-9D01-202609250001:1:99",
          name: "HCBB07-KA · Démo",
          beaconUuid: "AD5A1DE0-7BEE-4A11-9D01-202609250001",
          major: 1,
          minor: 99,
          lastRssi: -57,
          lastSeenAt: new Date(),
        },
      });

  console.log("[6/7] Session GPS de démonstration");
  const coordinates = [
    [48.85661, 2.35222],
    [48.85808, 2.34618],
    [48.86033, 2.34091],
    [48.86352, 2.33701],
    [48.86678, 2.33315],
    [48.87011, 2.32942],
    [48.87365, 2.32529],
    [48.87683, 2.32039],
    [48.87961, 2.31588],
  ].map(([latitude, longitude]) => ({ latitude, longitude }));
  const startedAt = new Date(Date.now() - (coordinates.length - 1) * 60_000);
  const distanceMeters = coordinates.slice(1).reduce(
    (total, point, index) => total + haversineMeters(coordinates[index], point),
    0,
  );

  let tracking = await db.trackingSession.findFirst({
    where: { userId: demoDriver.id, bookingId: demoBooking.id },
    orderBy: { createdAt: "desc" },
  });
  tracking = tracking
    ? await db.trackingSession.update({
        where: { id: tracking.id },
        data: {
          beaconDeviceId: beacon.id,
          status: "ACTIVE",
          startedAt,
          endedAt: null,
          lastPointAt: new Date(),
          distanceMeters,
        },
      })
    : await db.trackingSession.create({
        data: {
          userId: demoDriver.id,
          beaconDeviceId: beacon.id,
          bookingId: demoBooking.id,
          status: "ACTIVE",
          startedAt,
          lastPointAt: new Date(),
          distanceMeters,
        },
      });

  console.log("[7/7] Parcours GPS");
  const previousPoints = await db.locationPoint.findMany({
    where: { sessionId: tracking.id },
    select: { id: true },
  });
  for (const point of previousPoints) {
    await db.locationPoint.delete({ where: { id: point.id } });
  }
  for (const [index, point] of coordinates.entries()) {
    await db.locationPoint.create({
      data: {
        ...point,
        sessionId: tracking.id,
        accuracy: 7 + (index % 3),
        speed: 8.5 + (index % 4),
        heading: 310,
        recordedAt: new Date(startedAt.getTime() + index * 60_000),
      },
    });
  }

  console.log(JSON.stringify({
    testAccount: { email: TEST_EMAIL, password: TEST_PASSWORD },
    campaign: ad.title,
    bookingStatus: "CONFIRMED",
    demoTrackingSessionId: tracking.id,
  }, null, 2));
}

try {
  await main();
} finally {
  await db.$disconnect();
}
