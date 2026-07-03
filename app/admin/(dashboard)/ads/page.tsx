import Link from "next/link";
import { db } from "@/lib/db";
import { Clock, CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING_REVIEW:       { label: "En attente",   color: "text-yellow-400 bg-yellow-400/10", icon: Clock },
  PENDING_MODIFICATION: { label: "Modification", color: "text-orange-400 bg-orange-400/10", icon: AlertTriangle },
  APPROVED:             { label: "Approuvée",    color: "text-green-400 bg-green-400/10",   icon: CheckCircle },
  REJECTED:             { label: "Refusée",      color: "text-red-400 bg-red-400/10",       icon: XCircle },
};

export default async function AdminAdsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const whereStatus = status && STATUS_CONFIG[status] ? status : undefined;

  const ads = await db.ad.findMany({
    where: whereStatus ? { status: whereStatus } : undefined,
    include: { advertiser: { select: { name: true, companyName: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const counts = await db.ad.groupBy({ by: ["status"], _count: true });
  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c.status] = c._count;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Annonces</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/ads"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!whereStatus ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
        >
          Toutes ({ads.length})
        </Link>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <Link
            key={key}
            href={`/admin/ads?status=${key}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${whereStatus === key ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
          >
            {cfg.label} ({countMap[key] ?? 0})
          </Link>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {ads.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-12">Aucune annonce</p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {ads.map((ad) => {
              const cfg = STATUS_CONFIG[ad.status] ?? STATUS_CONFIG.PENDING_REVIEW;
              const StatusIcon = cfg.icon;
              return (
                <Link
                  key={ad.id}
                  href={`/admin/ads/${ad.id}`}
                  className="flex items-center gap-4 p-5 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{ad.title}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      {ad.advertiser.companyName ?? ad.advertiser.name} · {ad.advertiser.email}
                    </p>
                    <p className="text-zinc-600 text-xs mt-0.5">
                      {ad.pricePerDay.toFixed(2)}€/jour · Budget {ad.totalBudget.toFixed(0)}€ · {new Date(ad.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Eye className="w-3.5 h-3.5" /> {ad.viewCount ?? 0}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
