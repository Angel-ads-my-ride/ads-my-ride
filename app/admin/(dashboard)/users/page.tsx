import { db } from "@/lib/db";
import UserActions from "./UserActions";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      companyName: true,
      _count: { select: { ads: true, bookings: true } },
    },
  });

  const ROLE_COLORS: Record<string, string> = {
    CUSTOMER:    "text-blue-400 bg-blue-400/10",
    ADVERTISER:  "text-purple-400 bg-purple-400/10",
    SUPER_ADMIN: "text-yellow-400 bg-yellow-400/10",
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Utilisateurs ({users.length})</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-zinc-800">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-4 p-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-medium text-sm">{user.name}</p>
                  {user.companyName && (
                    <span className="text-zinc-500 text-xs">({user.companyName})</span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[user.role] ?? "text-zinc-400 bg-zinc-700"}`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {user.email} · Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </p>
                <p className="text-zinc-600 text-xs mt-0.5">
                  {user._count.ads} annonce{user._count.ads !== 1 ? "s" : ""} · {user._count.bookings} candidature{user._count.bookings !== 1 ? "s" : ""}
                </p>
              </div>
              <UserActions userId={user.id} currentRole={user.role} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
