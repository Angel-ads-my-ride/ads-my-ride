import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Euro, Car, Calendar, TrendingUp, Clock, CheckCircle, XCircle, ArrowRight, Wallet } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:   { label: "En attente", color: "text-amber-600 bg-amber-50 border border-amber-200",   icon: Clock },
  CONFIRMED: { label: "Confirmé",   color: "text-blue-600 bg-blue-50 border border-blue-200",      icon: Calendar },
  COMPLETED: { label: "Terminé",    color: "text-green-600 bg-green-50 border border-green-200",   icon: CheckCircle },
  CANCELLED: { label: "Annulé",     color: "text-red-600 bg-red-50 border border-red-200",         icon: XCircle },
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "CUSTOMER") redirect("/auth/login");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      carBrand: true,
      carModel: true,
      earnings: true,
      bookings: {
        select: {
          id: true,
          status: true,
          earnings: true,
          ad: {
            select: {
              title: true,
              advertiser: { select: { companyName: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) redirect("/auth/login");

  const totalEarnings  = user.bookings.filter((b) => b.status === "COMPLETED").reduce((s, b) => s + b.earnings, 0);
  const activeBookings = user.bookings.filter((b) => b.status === "CONFIRMED").length;
  const doneBookings   = user.bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bonjour, {user.name} 👋</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {user.carBrand && user.carModel ? `Votre véhicule : ${user.carBrand} ${user.carModel}` : "Aucun véhicule renseigné"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "Gains totaux",        value: `${totalEarnings.toFixed(2)}€`,   icon: Euro,        color: "text-green-600",  bg: "bg-green-50  border-green-100" },
            { label: "Campagnes actives",   value: String(activeBookings),           icon: TrendingUp,  color: "text-blue-600",   bg: "bg-blue-50   border-blue-100" },
            { label: "Terminées",           value: String(doneBookings),             icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
            { label: "Solde disponible",    value: `${user.earnings.toFixed(2)}€`,   icon: Wallet,      color: "text-zinc-800", bg: "bg-zinc-50 border-zinc-100" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${s.bg}`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
                <h2 className="font-semibold text-gray-900">Mes candidatures</h2>
                <Link href="/#annonces" className="w-fit text-zinc-700 hover:text-zinc-800 text-sm font-medium flex items-center gap-1">
                  Parcourir les annonces <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {user.bookings.length === 0 ? (
                <div className="text-center py-10 sm:py-12">
                  <Car className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400">Aucune candidature pour le moment</p>
                  <Link href="/#annonces" className="inline-block mt-4 bg-zinc-700 hover:bg-zinc-800 text-zinc-900 text-sm font-semibold px-5 py-2 rounded-xl transition-colors shadow-sm">
                    Voir les annonces
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.bookings.map((booking: typeof user.bookings[number]) => {
                    const st = STATUS_LABELS[booking.status] ?? STATUS_LABELS.PENDING;
                    return (
                      <div key={booking.id} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 sm:flex-row sm:items-center sm:gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${st.color}`}>
                          <st.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{booking.ad.title}</p>
                          <p className="text-gray-400 text-xs">{booking.ad.advertiser.companyName ?? booking.ad.advertiser.name}</p>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${st.color}`}>
                            {st.label}
                          </span>
                          {booking.earnings > 0 && <p className="text-green-600 text-xs mt-1">+{booking.earnings.toFixed(2)}€</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Side */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Mon véhicule</h2>
              {user.carBrand && user.carModel ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center">
                    <Car className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.carBrand}</p>
                    <p className="text-gray-500 text-sm">{user.carModel}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Car className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm mb-3">Aucun véhicule renseigné</p>
                  <Link href="/dashboard/settings" className="text-zinc-700 hover:text-zinc-800 text-sm font-medium">
                    Ajouter mon véhicule →
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-2">Retirer mes gains</h2>
              <p className="text-gray-500 text-sm mb-4">
                Solde : <span className="text-gray-900 font-semibold">{user.earnings.toFixed(2)}€</span>
              </p>
              <button disabled className="w-full bg-gray-100 text-gray-400 text-sm font-medium py-2.5 rounded-xl cursor-not-allowed border border-gray-200">
                Bientôt disponible
              </button>
              <p className="text-gray-400 text-xs mt-2 text-center">La fonction de retrait arrive prochainement</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
