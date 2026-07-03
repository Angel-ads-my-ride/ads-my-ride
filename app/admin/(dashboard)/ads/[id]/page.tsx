import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowLeft, Car, Euro, Users, Eye, EyeOff, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import ReviewForm from "./ReviewForm";

const STATUS_BADGE: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING_REVIEW:       { label: "En attente",   color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", icon: Clock },
  PENDING_MODIFICATION: { label: "Modification", color: "text-orange-400 bg-orange-400/10 border-orange-400/30", icon: AlertTriangle },
  APPROVED:             { label: "Approuvée",    color: "text-green-400 bg-green-400/10 border-green-400/30",   icon: CheckCircle },
  REJECTED:             { label: "Refusée",      color: "text-red-400 bg-red-400/10 border-red-400/30",         icon: XCircle },
};

export default async function AdminAdReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const ad = await db.ad.findUnique({
    where: { id },
    include: {
      advertiser: { select: { name: true, companyName: true, email: true } },
      eligibleModels: true,
      _count: { select: { bookings: true } },
    },
  });

  if (!ad) notFound();

  const badge = STATUS_BADGE[ad.status] ?? STATUS_BADGE.PENDING_REVIEW;
  const BadgeIcon = badge.icon;

  const groupedModels = ad.eligibleModels.reduce<Record<string, string[]>>((acc, m) => {
    if (!acc[m.brand]) acc[m.brand] = [];
    acc[m.brand].push(m.model);
    return acc;
  }, {});

  return (
    <div className="p-8">
      <Link href="/admin/ads" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux annonces
      </Link>

      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{ad.title}</h1>
            <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${badge.color}`}>
              <BadgeIcon className="w-3 h-3" />
              {badge.label}
            </span>
          </div>
          <p className="text-zinc-400 text-sm">
            Par {ad.advertiser.companyName ?? ad.advertiser.name} ({ad.advertiser.email}) · soumis le {new Date(ad.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ad details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image */}
          <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
            {ad.isConfidential ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <EyeOff className="w-12 h-12 text-zinc-700" />
                <p className="text-zinc-600 text-sm">Image confidentielle</p>
              </div>
            ) : ad.imageUrl ? (
              <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="w-16 h-16 text-zinc-700" />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-3">Description</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{ad.description}</p>
          </div>

          {/* Admin message if any */}
          {ad.adminMessage && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="font-semibold text-zinc-300 mb-2 text-sm">Dernier message admin</h2>
              <p className="text-zinc-400 text-sm">{ad.adminMessage}</p>
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Prix / jour",    value: `${ad.pricePerDay.toFixed(2)}€`,  icon: Euro },
              { label: "Budget total",   value: `${ad.totalBudget.toFixed(0)}€`,  icon: Euro },
              { label: "Candidatures",   value: String(ad._count.bookings),       icon: Users },
              { label: "Vues",           value: String(ad.viewCount ?? 0),        icon: Eye },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Options flags */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-wrap gap-4">
            <div className="text-sm">
              <span className="text-zinc-500">Image confidentielle : </span>
              <span className={ad.isConfidential ? "text-yellow-400" : "text-zinc-300"}>{ad.isConfidential ? "Oui" : "Non"}</span>
            </div>
            <div className="text-sm">
              <span className="text-zinc-500">Auto-accept : </span>
              <span className={ad.autoAccept ? "text-green-400" : "text-zinc-300"}>{ad.autoAccept ? "Oui" : "Non"}</span>
            </div>
            {ad.maxApplicants && (
              <div className="text-sm">
                <span className="text-zinc-500">Max candidatures : </span>
                <span className="text-zinc-300">{ad.maxApplicants}</span>
              </div>
            )}
          </div>

          {/* Eligible models */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Véhicules éligibles ({ad.eligibleModels.length})</h2>
            <div className="space-y-3">
              {(Object.entries(groupedModels) as [string, string[]][]).map(([brand, models]) => (
                <div key={brand}>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1.5">{brand}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {models.map((m) => (
                      <span key={m} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded-md">{m}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review form */}
        <div>
          <ReviewForm adId={id} currentStatus={ad.status} />
        </div>
      </div>
    </div>
  );
}
