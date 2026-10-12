import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET ?? "ads-my-ride-secret-key-change-in-prod";
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  role: string;
  expiresAt: Date;
};

export type TrackingTokenPayload = {
  userId: string;
  sessionId: string;
  scope: "TRACKING_UPLOAD";
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function createMobileToken(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  return new SignJWT({ userId, role, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(encodedKey);
}

export async function createTrackingToken(userId: string, sessionId: string) {
  return new SignJWT({ userId, sessionId, scope: "TRACKING_UPLOAD" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(encodedKey);
}

export async function decryptTrackingToken(token: string | undefined = ""): Promise<TrackingTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    if (
      payload.scope !== "TRACKING_UPLOAD" ||
      typeof payload.userId !== "string" ||
      typeof payload.sessionId !== "string"
    ) return null;
    return {
      userId: payload.userId,
      sessionId: payload.sessionId,
      scope: "TRACKING_UPLOAD",
    };
  } catch {
    return null;
  }
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  return decrypt(cookie);
}
