-- CreateTable
ALTER TABLE "users" ADD COLUMN "mobileOnboardingCompletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "beacon_devices" (
    "id" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'HCBB07-KA',
    "serviceUuid" TEXT,
    "beaconUuid" TEXT,
    "major" INTEGER,
    "minor" INTEGER,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3),
    "lastRssi" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "beacon_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "beaconDeviceId" TEXT NOT NULL,
    "bookingId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "lastPointAt" TIMESTAMP(3),
    "distanceMeters" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tracking_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_points" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "altitude" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "location_points_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "beacon_devices_serial_key" ON "beacon_devices"("serial");
CREATE UNIQUE INDEX "beacon_devices_userId_key" ON "beacon_devices"("userId");
CREATE INDEX "tracking_sessions_userId_status_idx" ON "tracking_sessions"("userId", "status");
CREATE INDEX "tracking_sessions_bookingId_idx" ON "tracking_sessions"("bookingId");
CREATE UNIQUE INDEX "location_points_sessionId_recordedAt_key" ON "location_points"("sessionId", "recordedAt");
CREATE INDEX "location_points_sessionId_recordedAt_idx" ON "location_points"("sessionId", "recordedAt");

ALTER TABLE "beacon_devices" ADD CONSTRAINT "beacon_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tracking_sessions" ADD CONSTRAINT "tracking_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tracking_sessions" ADD CONSTRAINT "tracking_sessions_beaconDeviceId_fkey" FOREIGN KEY ("beaconDeviceId") REFERENCES "beacon_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tracking_sessions" ADD CONSTRAINT "tracking_sessions_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "location_points" ADD CONSTRAINT "location_points_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "tracking_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
