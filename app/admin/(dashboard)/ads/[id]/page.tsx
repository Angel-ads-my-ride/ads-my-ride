import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowLeft, Car, Euro, Users, Eye, EyeOff, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import ReviewForm from "./ReviewForm";

const STATUS_BADGE: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING_REVIEW:       { label: "En attente",   color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
  PENDING_MODIFICATION: { label: "Modification", color: "text-orange-600 bg-orange-50 border-orange-200", icon: AlertTriangle },
  APPROVED:             { label: "Approuvée",    color: "text-green-600 bg-green-50 border-green-200",   icon: CheckCircle },
  REJECTED:             { label: "Refusée",      color: "text-red-600 bg-red-50 border-red-200",         icon: XCircle },
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
      <Link href="/admin/ads" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux annonces
      </Link>

      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{ad.title}</h1>
            <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${badge.color}`}>
              <BadgeIcon className="w-3 h-3" />
              {badge.label}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Par {ad.advertiser.companyName ?? ad.advertiser.name} ({ad.advertiser.email}) · soumis le {new Date(ad.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ad details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image */}
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            {ad.isConfidential ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <EyeOff className="w-12 h-12 text-gray-300" />
                <p className="text-gray-400 text-sm">Image confidentielle</p>
              </div>
            ) : ad.imageUrl ? (
              <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="w-16 h-16 text-gray-300" />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{ad.description}</p>
          </div>

          {/* Admin message if any */}
          {ad.adminMessage && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-2 text-sm">Dernier message admin</h2>
              <p className="text-gray-500 text-sm">{ad.adminMessage}</p>
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
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Options flags */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-wrap gap-4 shadow-sm">
            <div className="text-sm">
              <span className="text-gray-500">Image confidentielle : </span>
              <span className={ad.isConfidential ? "text-amber-600 font-medium" : "text-gray-700"}>{ad.isConfidential ? "Oui" : "Non"}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Auto-accept : </span>
              <span className={ad.autoAccept ? "text-green-600 font-medium" : "text-gray-700"}>{ad.autoAccept ? "Oui" : "Non"}</span>
            </div>
            {ad.maxApplicants && (
              <div className="text-sm">
                <span className="text-gray-500">Max candidatures : </span>
                <span className="text-gray-700">{ad.maxApplicants}</span>
              </div>
            )}
          </div>

          {/* Eligible models */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Véhicules éligibles ({ad.eligibleModels.length})</h2>
            <div className="space-y-3">
              {(Object.entries(groupedModels) as [string, string[]][]).map(([brand, models]) => (
                <div key={brand}>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1.5">{brand}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {models.map((m) => (
                      <span key={m} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-md">{m}</span>
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
