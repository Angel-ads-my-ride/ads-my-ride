import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { ArrowLeft, Car, Euro, Users, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "text-yellow-400 bg-yellow-400/10" },
  CONFIRMED: { label: "Confirmé", color: "text-blue-400 bg-blue-400/10" },
  COMPLETED: { label: "Terminé", color: "text-green-400 bg-green-400/10" },
  CANCELLED: { label: "Annulé", color: "text-red-400 bg-red-400/10" },
};

export default async function AdvertiserAdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") redirect("/advertiser/auth/login");

  const ad = await db.ad.findFirst({
    where: { id, advertiserId: session.userId },
    include: {
      eligibleModels: true,
      bookings: {
        include: { user: { select: { name: true, email: true, carBrand: true, carModel: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!ad) notFound();

  const groupedModels = ad.eligibleModels.reduce<Record<string, string[]>>((acc: Record<string, string[]>, m: { brand: string; model: string }) => {
    if (!acc[m.brand]) acc[m.brand] = [];
    acc[m.brand].push(m.model);
    return acc;
  }, {});

  const budgetUsedPct = Math.max(
    0,
    Math.min(100, ((ad.totalBudget - ad.remainingBudget) / ad.totalBudget) * 100)
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/advertiser/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <span className="text-zinc-700">|</span>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-700 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-bold text-sm">
              Ads <span className="text-zinc-700">My Ride</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{ad.title}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ad.isActive ? "bg-green-500/10 text-green-400" : "bg-zinc-700 text-zinc-400"}`}>
                {ad.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-zinc-400 text-sm">Créée le {new Date(ad.createdAt).toLocaleDateString("fr-FR")}</p>
          </div>
          <Link
            href={`/advertiser/ads/${id}/edit`}
            className="text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl transition-colors"
          >
            Modifier l&apos;annonce
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Candidatures", value: String(ad.bookings.length), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
                { label: "Rémunération / jour", value: `${ad.pricePerDay.toFixed(2)}€`, icon: Euro, color: "text-zinc-500", bg: "bg-zinc-600/10" },
                { label: "Budget restant", value: `${ad.remainingBudget.toFixed(2)}€`, icon: Calendar, color: "text-green-400", bg: "bg-green-400/10" },
              ].map((s) => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Budget progress */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-white">Budget utilisé</h2>
                <span className="text-zinc-400 text-sm">
                  {(ad.totalBudget - ad.remainingBudget).toFixed(2)}€ / {ad.totalBudget.toFixed(2)}€
                </span>
              </div>
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-700 rounded-full transition-all"
                  style={{ width: `${budgetUsedPct}%` }}
                />
              </div>
              <p className="text-zinc-500 text-xs mt-2">{budgetUsedPct.toFixed(1)}% utilisé</p>
            </div>

            {/* Bookings */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-4">
                Candidatures ({ad.bookings.length})
              </h2>
              {ad.bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                  <p className="text-zinc-500 text-sm">Aucune candidature pour le moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ad.bookings.map((booking: typeof ad.bookings[number]) => {
                    const st = STATUS_LABELS[booking.status] ?? STATUS_LABELS.PENDING;
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm">{booking.user.name}</p>
                          <p className="text-zinc-500 text-xs">
                            {booking.user.email} · {booking.user.carBrand} {booking.user.carModel}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${st.color}`}>
                            {st.label}
                          </span>
                          <p className="text-zinc-600 text-xs mt-1">
                            {new Date(booking.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Eligible models */}
          <div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Car className="w-4 h-4 text-zinc-700" />
                Modèles éligibles
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {(Object.entries(groupedModels) as [string, string[]][]).map(([brand, models]) => (
                  <div key={brand}>
                    <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2">{brand}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {models.map((model) => (
                        <span key={model} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded-md">
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-zinc-600 text-xs mt-4 pt-4 border-t border-zinc-800">
                {ad.eligibleModels.length} modèles au total
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
