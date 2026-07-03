import { db } from "@/lib/db";
import { Users, FileText, Clock, ClipboardList, Eye } from "lucide-react";

export default async function AdminDashboardPage() {
  const [totalUsers, totalAds, pendingAds, totalBookings, viewAgg] = await Promise.all([
    db.user.count(),
    db.ad.count(),
    db.ad.count({ where: { status: "PENDING_REVIEW" } }),
    db.booking.count(),
    db.ad.aggregate({ _sum: { viewCount: true } }),
  ]);
  const totalViews = viewAgg._sum.viewCount ?? 0;

  const recentAds = await db.ad.findMany({
    where: { status: "PENDING_REVIEW" },
    include: { advertiser: { select: { name: true, companyName: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Utilisateurs",       value: totalUsers,   icon: Users,         color: "text-blue-400",   bg: "bg-blue-400/10" },
    { label: "Annonces",           value: totalAds,     icon: FileText,      color: "text-zinc-400",   bg: "bg-zinc-600/10" },
    { label: "En attente review",  value: pendingAds,   icon: Clock,         color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Candidatures",       value: totalBookings,icon: ClipboardList, color: "text-green-400",  bg: "bg-green-400/10" },
    { label: "Vues totales",       value: totalViews,   icon: Eye,           color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value.toLocaleString("fr-FR")}</p>
            <p className="text-zinc-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-400" />
          Annonces en attente de validation ({pendingAds})
        </h2>
        {recentAds.length === 0 ? (
          <p className="text-zinc-500 text-sm py-4 text-center">Aucune annonce en attente</p>
        ) : (
          <div className="space-y-3">
            {recentAds.map((ad) => (
              <a
                key={ad.id}
                href={`/admin/ads/${ad.id}`}
                className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-colors"
              >
                <div>
                  <p className="text-white font-medium text-sm">{ad.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {ad.advertiser.companyName ?? ad.advertiser.name} · {new Date(ad.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full font-medium">
                  Review →
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
