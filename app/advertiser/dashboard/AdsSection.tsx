"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Euro, Users, Car, Power, Trash2, Eye, Pencil, BarChart3 } from "lucide-react";
import { toggleAdActive, deleteAd } from "@/app/actions/ads";
import AdForm, { ExistingAd } from "./AdForm";

type Ad = ExistingAd & {
  isActive: boolean;
  status: string;
  viewCount: number;
  _count: { bookings: number };
};

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  DRAFT:                { label: "Brouillon",              cls: "bg-gray-100 text-gray-500 border border-gray-200" },
  PENDING_REVIEW:       { label: "En attente de validation", cls: "bg-amber-50 text-amber-600 border border-amber-200" },
  PENDING_MODIFICATION: { label: "Modification demandée",   cls: "bg-orange-50 text-orange-600 border border-orange-200" },
  REJECTED:             { label: "Refusée",                 cls: "bg-red-50 text-red-600 border border-red-200" },
};

export default function AdsSection({ ads, isCertified }: { ads: Ad[]; isCertified: boolean }) {
  const [formMode, setFormMode] = useState<null | "new" | Ad>(null);
  const router = useRouter();

  function close() {
    setFormMode(null);
    router.refresh();
  }

  if (formMode) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
        <h2 className="font-semibold text-gray-900 mb-5 sm:mb-6">
          {formMode === "new" ? "Nouvelle annonce" : "Modifier l'annonce"}
        </h2>
        <AdForm
          ad={formMode === "new" ? undefined : formMode}
          isCertified={isCertified}
          onSaved={close}
          onCancel={() => setFormMode(null)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-gray-900">Mes annonces</h2>
        <button
          onClick={() => setFormMode("new")}
          className="text-zinc-700 hover:text-zinc-800 text-sm font-medium flex items-center gap-1 rounded-lg px-2 py-1.5 transition-all duration-150 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" /> Créer
        </button>
      </div>

      {ads.length === 0 ? (
        <div className="text-center py-12 sm:py-16 px-4 sm:px-6">
          <BarChart3 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">Aucune annonce créée</p>
          <p className="text-gray-400 text-sm mb-5">Créez votre première campagne et touchez des milliers de conducteurs.</p>
          <button
            onClick={() => setFormMode("new")}
            className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-800 text-zinc-900 font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 text-sm shadow-sm cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Créer une annonce
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {ads.map((ad) => {
            const badge = STATUS_BADGE[ad.status];
            return (
              <div key={ad.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-full sm:w-20 h-14 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                  {ad.imageUrl
                    ? <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Car className="w-6 h-6 text-gray-300" /></div>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm min-w-0 max-w-full truncate">{ad.title}</h3>
                    {badge ? (
                      <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>{badge.label}</span>
                    ) : (
                      <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${ad.isActive ? "bg-green-50 text-green-600 border border-green-200" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                        {ad.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Euro className="w-3 h-3" />{ad.pricePerDay.toFixed(2)}€/jour</span>
                    <span className="flex items-center gap-1"><Car className="w-3 h-3" />{ad.eligibleModels.length} modèle{ad.eligibleModels.length !== 1 ? "s" : ""} {ad.modelSelectionMode === "ALL_EXCEPT" ? "exclu(s)" : "sélectionné(s)"}</span>
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
                  <a href={`/advertiser/ads/${ad.id}`} className="w-9 h-9 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors" title="Voir">
                    <Eye className="w-3.5 h-3.5 text-gray-600" />
                  </a>
                  <button onClick={() => setFormMode(ad)} className="w-9 h-9 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors cursor-pointer active:scale-[0.98]" title="Modifier">
                    <Pencil className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  {ad.status === "APPROVED" && (
                    <form action={toggleAdActive.bind(null, ad.id, !ad.isActive)}>
                      <button type="submit" title={ad.isActive ? "Désactiver" : "Activer"}
                        className={`w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer active:scale-[0.98] ${ad.isActive ? "bg-green-50 hover:bg-green-100 border border-green-200" : "bg-gray-100 hover:bg-gray-200 border border-gray-200"}`}>
                        <Power className={`w-3.5 h-3.5 ${ad.isActive ? "text-green-600" : "text-gray-500"}`} />
                      </button>
                    </form>
                  )}
                  <form action={deleteAd.bind(null, ad.id)}>
                    <button type="submit" title="Supprimer" className="w-9 h-9 sm:w-8 sm:h-8 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg flex items-center justify-center transition-colors cursor-pointer active:scale-[0.98]">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
