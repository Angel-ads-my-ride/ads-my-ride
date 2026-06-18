import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { logout } from "@/app/actions/auth";
import { toggleAdActive, deleteAd } from "@/app/actions/ads";
import { Plus, Euro, Users, TrendingUp, BarChart3, Car, Power, Trash2, Eye, Pencil } from "lucide-react";

export default async function AdvertiserDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") redirect("/advertiser/auth/login");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      ads: {
        include: { eligibleModels: true, bookings: true, _count: { select: { bookings: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/advertiser/auth/login");

  const totalAds     = user.ads.length;
  const activeAds    = user.ads.filter((a) => a.isActive).length;
  const totalBook    = user.ads.reduce((s, a) => s + a._count.bookings, 0);
  const totalSpent   = user.ads.reduce((s, a) => s + (a.totalBudget - a.remainingBudget), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-700 rounded-md flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-bold text-gray-900">Ads <span className="text-zinc-700">My Ride</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm hidden sm:block">{user.companyName ?? user.name}</span>
            <form action={logout}>
              <button type="submit" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Déconnexion</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard — {user.companyName ?? user.name}</h1>
            <p className="text-gray-500 mt-1 text-sm">Gérez vos campagnes publicitaires</p>
          </div>
          <Link href="/advertiser/ads/new"
            className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
            <Plus className="w-4 h-4" /> Nouvelle annonce
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Annonces totales", value: String(totalAds),             icon: BarChart3,  color: "text-blue-600",   bg: "bg-blue-50   border-blue-100" },
            { label: "Actives",          value: String(activeAds),            icon: TrendingUp, color: "text-green-600",  bg: "bg-green-50  border-green-100" },
            { label: "Candidatures",     value: String(totalBook),            icon: Users,      color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
            { label: "Budget dépensé",   value: `${totalSpent.toFixed(2)}€`, icon: Euro,       color: "text-zinc-800", bg: "bg-zinc-50 border-zinc-100" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${s.bg}`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Ads list */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Mes annonces</h2>
            <Link href="/advertiser/ads/new" className="text-zinc-700 hover:text-zinc-800 text-sm font-medium flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Créer
            </Link>
          </div>

          {user.ads.length === 0 ? (
            <div className="text-center py-16 px-6">
              <BarChart3 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">Aucune annonce créée</p>
              <p className="text-gray-400 text-sm mb-5">Créez votre première campagne et touchez des milliers de conducteurs.</p>
              <Link href="/advertiser/ads/new"
                className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
                <Plus className="w-4 h-4" /> Créer une annonce
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {user.ads.map((ad: typeof user.ads[number]) => (
                <div key={ad.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-full sm:w-20 h-14 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                    {ad.imageUrl
                      ? <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Car className="w-6 h-6 text-gray-300" /></div>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{ad.title}</h3>
                      <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${ad.isActive ? "bg-green-50 text-green-600 border border-green-200" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                        {ad.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Euro className="w-3 h-3" />{ad.pricePerDay.toFixed(2)}€/jour</span>
                      <span className="flex items-center gap-1"><Car className="w-3 h-3" />{ad.eligibleModels.length} modèles</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ad._count.bookings} candidatures</span>
                      <span>Budget : {ad.remainingBudget.toFixed(0)}€ / {ad.totalBudget.toFixed(0)}€</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-28">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-700 rounded-full"
                        style={{ width: `${Math.max(0, Math.min(100, ((ad.totalBudget - ad.remainingBudget) / ad.totalBudget) * 100))}%` }} />
                    </div>
                    <p className="text-gray-400 text-xs mt-1 text-right">
                      {(((ad.totalBudget - ad.remainingBudget) / ad.totalBudget) * 100).toFixed(0)}% utilisé
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/advertiser/ads/${ad.id}`} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors" title="Voir">
                      <Eye className="w-3.5 h-3.5 text-gray-600" />
                    </Link>
                    <Link href={`/advertiser/ads/${ad.id}/edit`} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors" title="Modifier">
                      <Pencil className="w-3.5 h-3.5 text-gray-600" />
                    </Link>
                    <form action={toggleAdActive.bind(null, ad.id, !ad.isActive)}>
                      <button type="submit" title={ad.isActive ? "Désactiver" : "Activer"}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${ad.isActive ? "bg-green-50 hover:bg-green-100 border border-green-200" : "bg-gray-100 hover:bg-gray-200 border border-gray-200"}`}>
                        <Power className={`w-3.5 h-3.5 ${ad.isActive ? "text-green-600" : "text-gray-500"}`} />
                      </button>
                    </form>
                    <form action={deleteAd.bind(null, ad.id)}>
                      <button type="submit" title="Supprimer" className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg flex items-center justify-center transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
