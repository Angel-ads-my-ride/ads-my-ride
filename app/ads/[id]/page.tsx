import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Euro, Car, Calendar, Users, ArrowLeft, CheckCircle, EyeOff } from "lucide-react";
import ApplyButton from "./ApplyButton";
import { incrementViewCount } from "@/app/actions/ads";

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  const ad = await db.ad.findUnique({
    where: { id, status: "APPROVED" },
    include: {
      advertiser: { select: { companyName: true, name: true } },
      eligibleModels: true,
      _count: { select: { bookings: true } },
    },
  });

  if (!ad) notFound();

  incrementViewCount(id).catch(() => null);

  let alreadyApplied = false;
  if (session?.userId) {
    const booking = await db.booking.findFirst({ where: { userId: session.userId, adId: id } });
    alreadyApplied = !!booking;
  }

  const groupedModels = ad.eligibleModels.reduce<Record<string, string[]>>((acc: Record<string, string[]>, m: { brand: string; model: string }) => {
    if (!acc[m.brand]) acc[m.brand] = [];
    acc[m.brand].push(m.model);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Retour aux annonces
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <img src="/Logo.png" alt="Ads My Ride" className="w-6 h-6 object-contain" />
            <span className="font-bold text-sm text-gray-900">Ads <span className="text-zinc-700">My Ride</span></span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              {ad.isConfidential ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <EyeOff className="w-12 h-12 text-gray-300" />
                  <p className="text-gray-400 text-sm">Visuel confidentiel</p>
                </div>
              ) : ad.imageUrl ? (
                <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Car className="w-16 h-16 text-gray-300" /></div>
              )}
            </div>

            <div>
              <p className="text-zinc-700 text-sm font-semibold mb-1">{ad.advertiser.companyName ?? ad.advertiser.name}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{ad.title}</h1>
              <p className="text-gray-500 leading-relaxed">{ad.description}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="w-4 h-4 text-zinc-700" />
                Véhicules éligibles ({ad.eligibleModels.length} modèles)
              </h2>
              <div className="space-y-4">
                {(Object.entries(groupedModels) as [string, string[]][]).map(([brand, models]) => (
                  <div key={brand}>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{brand}</p>
                    <div className="flex flex-wrap gap-2">
                      {models.map((model) => (
                        <span key={model} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-lg border border-gray-200">{model}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6 shadow-sm">
              <div className="text-center mb-6">
                <p className="text-4xl font-black text-gray-900">{ad.pricePerDay.toFixed(2)}€</p>
                <p className="text-gray-400 text-sm">par jour</p>
                <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
                  <span>≈ {(ad.pricePerDay * 7).toFixed(2)}€/sem</span>
                  <span>≈ {(ad.pricePerDay * 30).toFixed(0)}€/mois</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { icon: Users,    label: "Candidatures",   value: `${ad._count.bookings}` },
                  { icon: Euro,     label: "Budget restant",  value: `${ad.remainingBudget.toFixed(2)}€` },
                  { icon: Calendar, label: "Statut",          value: ad.isActive && ad.remainingBudget > 0 ? "Active" : "Fermée" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <item.icon className="w-3.5 h-3.5" />{item.label}
                    </span>
                    <span className="text-gray-900 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>

              {alreadyApplied ? (
                <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-600 py-3 rounded-xl text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" /> Candidature envoyée
                </div>
              ) : session?.role === "CUSTOMER" ? (
                <ApplyButton adId={id} />
              ) : (
                <Link href="/auth/register" className="block text-center bg-zinc-700 hover:bg-zinc-800 text-zinc-900 font-semibold py-3 rounded-xl transition-colors shadow-sm">
                  S&apos;inscrire pour candidater
                </Link>
              )}

              {!session && (
                <p className="text-gray-400 text-xs text-center mt-3">
                  Déjà inscrit ?{" "}
                  <Link href="/auth/login" className="text-gray-600 hover:text-gray-800">Se connecter</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
