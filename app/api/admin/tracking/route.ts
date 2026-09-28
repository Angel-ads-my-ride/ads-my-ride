import { getAdminTrackingSessions } from "@/lib/admin-tracking";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  return Response.json({ sessions: await getAdminTrackingSessions() });
}
