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
      isCertified: true,
      _count: { select: { ads: true, bookings: true } },
    },
  });

  const ROLE_COLORS: Record<string, string> = {
    CUSTOMER:    "text-blue-600 bg-blue-50",
    ADVERTISER:  "text-purple-600 bg-purple-50",
    SUPER_ADMIN: "text-amber-600 bg-amber-50",
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Utilisateurs ({users.length})</h1>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-4 p-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-gray-900 font-medium text-sm">{user.name}</p>
                  {user.companyName && (
                    <span className="text-gray-500 text-xs">({user.companyName})</span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[user.role] ?? "text-gray-500 bg-gray-100"}`}>
                    {user.role}
                  </span>
                  {user.role === "ADVERTISER" && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.isCertified ? "text-green-700 bg-green-50" : "text-red-600 bg-red-50"}`}>
                      {user.isCertified ? "Certifié" : "Non certifié"}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-0.5">
                  {user.email} · Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {user._count.ads} annonce{user._count.ads !== 1 ? "s" : ""} · {user._count.bookings} candidature{user._count.bookings !== 1 ? "s" : ""}
                </p>
              </div>
              <UserActions
                userId={user.id}
                currentRole={user.role}
                isCertified={user.isCertified}
                showCertify={user.role === "ADVERTISER" && !user.isCertified}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
