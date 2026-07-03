import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Euro, Users, TrendingUp, BarChart3 } from "lucide-react";
import AdsSection from "./AdsSection";

export default async function AdvertiserDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") redirect("/auth/login");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      ads: {
        include: { eligibleModels: true, bookings: true, _count: { select: { bookings: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/auth/login");

  const totalAds     = user.ads.length;
  const activeAds    = user.ads.filter((a) => a.isActive).length;
  const totalBook    = user.ads.reduce((s, a) => s + a._count.bookings, 0);
  const totalSpent   = user.ads.reduce((s, a) => s + (a.totalBudget - a.remainingBudget), 0);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard — {user.companyName ?? user.name}</h1>
          <p className="text-gray-500 mt-1 text-sm">Gérez vos campagnes publicitaires</p>
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

        <AdsSection ads={JSON.parse(JSON.stringify(user.ads))} />
      </main>
    </>
  );
}
