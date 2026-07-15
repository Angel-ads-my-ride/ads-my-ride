import { db } from "@/lib/db";
import { Users, FileText, Clock, ClipboardList, Eye, ShieldCheck } from "lucide-react";
import CertifyButton from "./users/CertifyButton";

export default async function AdminDashboardPage() {
  const [totalUsers, totalAds, pendingAds, pendingCertifications, totalBookings, viewAgg] = await Promise.all([
    db.user.count(),
    db.ad.count(),
    db.ad.count({ where: { status: "PENDING_REVIEW" } }),
    db.user.count({ where: { role: "ADVERTISER", isCertified: false } }),
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

  const advertisersToCertify = await db.user.findMany({
    where: { role: "ADVERTISER", isCertified: false },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, companyName: true, email: true, createdAt: true },
  });

  const stats = [
    { label: "Utilisateurs",         value: totalUsers,             icon: Users,         color: "text-blue-600",   bg: "bg-blue-50" },
    { label: "Annonces",             value: totalAds,               icon: FileText,      color: "text-zinc-800",   bg: "bg-zinc-50" },
    { label: "En attente review",    value: pendingAds,             icon: Clock,         color: "text-amber-600",  bg: "bg-amber-50" },
    { label: "À certifier",          value: pendingCertifications,  icon: ShieldCheck,   color: "text-red-600",    bg: "bg-red-50" },
    { label: "Candidatures",         value: totalBookings,          icon: ClipboardList, color: "text-green-600",  bg: "bg-green-50" },
    { label: "Vues totales",         value: totalViews,             icon: Eye,           color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString("fr-FR")}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          Annonces en attente de validation ({pendingAds})
        </h2>
        {recentAds.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">Aucune annonce en attente</p>
        ) : (
          <div className="space-y-3">
            {recentAds.map((ad) => (
              <a
                key={ad.id}
                href={`/admin/ads/${ad.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors"
              >
                <div>
                  <p className="text-gray-900 font-medium text-sm">{ad.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {ad.advertiser.companyName ?? ad.advertiser.name} · {new Date(ad.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
                  Review →
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-red-600" />
          Comptes annonceurs à certifier ({pendingCertifications})
        </h2>
        {advertisersToCertify.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">Aucun compte en attente de certification</p>
        ) : (
          <div className="space-y-3">
            {advertisersToCertify.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div>
                  <p className="text-gray-900 font-medium text-sm">{a.companyName ?? a.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {a.name} · {a.email} · Inscrit le {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <CertifyButton userId={a.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
