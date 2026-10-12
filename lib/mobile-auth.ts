import "server-only";
import {
  decrypt,
  decryptTrackingToken,
  type SessionPayload,
  type TrackingTokenPayload,
} from "@/lib/session";

export async function getMobileSession(request: Request): Promise<SessionPayload | null> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;

  const session = await decrypt(authorization.slice(7).trim());
  if (!session || session.role !== "CUSTOMER") return null;
  return session;
}

export async function getTrackingSession(request: Request): Promise<TrackingTokenPayload | null> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return decryptTrackingToken(authorization.slice(7).trim());
}

export function unauthorized() {
  return Response.json({ error: "Session invalide ou expirée." }, { status: 401 });
}
