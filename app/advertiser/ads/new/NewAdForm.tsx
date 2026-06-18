"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2, ChevronDown, Info } from "lucide-react";
import { createAd } from "@/app/actions/ads";
import { CAR_DATA, getModelsForBrand } from "@/lib/car-data";

type EligibleModel = { brand: string; model: string };

export default function NewAdForm() {
  const [state, action, pending] = useActionState(createAd, undefined);
  const [eligibleModels, setEligibleModels] = useState<EligibleModel[]>([]);
  const [addBrand, setAddBrand] = useState("");
  const [addModel, setAddModel] = useState("");

  const addModelsForBrand = getModelsForBrand(addBrand);

  function addEligibleModel() {
    if (!addBrand || !addModel) return;
    if (eligibleModels.some((m) => m.brand === addBrand && m.model === addModel)) return;
    setEligibleModels([...eligibleModels, { brand: addBrand, model: addModel }]);
    setAddModel("");
  }

  function addAllModelsForBrand() {
    if (!addBrand) return;
    const newModels = getModelsForBrand(addBrand)
      .filter((m) => !eligibleModels.some((e) => e.brand === addBrand && e.model === m))
      .map((m) => ({ brand: addBrand, model: m }));
    setEligibleModels([...eligibleModels, ...newModels]);
  }

  function removeModel(idx: number) {
    setEligibleModels(eligibleModels.filter((_, i) => i !== idx));
  }

  const groupedModels = eligibleModels.reduce<Record<string, string[]>>((acc: Record<string, string[]>, m: EligibleModel) => {
    if (!acc[m.brand]) acc[m.brand] = [];
    acc[m.brand].push(m.model);
    return acc;
  }, {});

  const inputCls = "w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400";
  const selectCls = `${inputCls} pr-10 appearance-none cursor-pointer`;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="eligibleModels" value={JSON.stringify(eligibleModels)} />

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}

      {/* Basic info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">Informations de la campagne</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre de l&apos;annonce *</label>
          <input name="title" type="text" required placeholder="Ex : Campagne été 2025 — Ma Marque" className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
          <textarea name="description" required rows={4} placeholder="Décrivez votre campagne, le visuel, les conditions…"
            className={`${inputCls} resize-none`} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            URL de l&apos;image / visuel <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <input name="imageUrl" type="url" placeholder="https://cdn.mamarque.fr/campagne.jpg" className={inputCls} />
        </div>
      </div>

      {/* Budget */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">Budget</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rémunération / jour par conducteur *</label>
            <div className="relative">
              <input name="pricePerDay" type="number" required min="0.01" step="0.01" placeholder="5.00"
                className={`${inputCls} pr-10`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget total *</label>
            <div className="relative">
              <input name="totalBudget" type="number" required min="1" step="0.01" placeholder="5000.00"
                className={`${inputCls} pr-10`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl p-3">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
          <span>La campagne se met en pause automatiquement quand le budget total est atteint.</span>
        </div>
      </div>

      {/* Eligible models */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900">Véhicules éligibles *</h2>
          <p className="text-gray-400 text-xs mt-1">Définissez quels modèles peuvent postuler à votre campagne.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <select value={addBrand} onChange={(e) => { setAddBrand(e.target.value); setAddModel(""); }} className={selectCls}>
              <option value="">-- Marque --</option>
              {CAR_DATA.map((d) => <option key={d.brand} value={d.brand}>{d.brand}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={addModel} onChange={(e) => setAddModel(e.target.value)} disabled={!addBrand}
              className={`${selectCls} disabled:opacity-40 disabled:cursor-not-allowed`}>
              <option value="">-- Modèle --</option>
              {addModelsForBrand.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={addEligibleModel} disabled={!addBrand || !addModel}
              className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Ajouter
            </button>
            <button type="button" onClick={addAllModelsForBrand} disabled={!addBrand} title="Ajouter tous les modèles de cette marque"
              className="px-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 text-sm rounded-xl transition-colors border border-gray-200">
              Tous
            </button>
          </div>
        </div>

        {eligibleModels.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-gray-400 text-sm">Aucun modèle sélectionné</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(Object.entries(groupedModels) as [string, string[]][]).map(([brand, models]) => (
              <div key={brand} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-700 font-semibold text-sm mb-2">{brand}</p>
                <div className="flex flex-wrap gap-2">
                  {models.map((model) => (
                    <span key={model} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-lg shadow-sm">
                      {model}
                      <button type="button"
                        onClick={() => { const idx = eligibleModels.findIndex((m) => m.brand === brand && m.model === model); if (idx !== -1) removeModel(idx); }}
                        className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-gray-400 text-xs">{eligibleModels.length} modèle{eligibleModels.length !== 1 ? "s" : ""} sélectionné{eligibleModels.length !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending || eligibleModels.length === 0}
          className="flex-1 sm:flex-none sm:px-8 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-sm">
          {pending ? "Publication…" : "Publier l'annonce"}
        </button>
        <a href="/advertiser/dashboard" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">Annuler</a>
      </div>
    </form>
  );
}
