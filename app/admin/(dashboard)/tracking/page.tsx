import { getAdminTrackingSessions } from "@/lib/admin-tracking";
import TrackingDashboard from "./TrackingDashboard";

export const dynamic = "force-dynamic";

export default async function AdminTrackingPage() {
  const sessions = await getAdminTrackingSessions();

  return <TrackingDashboard initialSessions={sessions} />;
}
