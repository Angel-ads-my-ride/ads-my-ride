"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2, ChevronDown, Info, EyeOff, Users, Zap } from "lucide-react";
import { createAd } from "@/app/actions/ads";
import { CAR_DATA, getModelsForBrand } from "@/lib/car-data";

type EligibleModel = { brand: string; model: string };

export default function NewAdForm() {
  const [state, action, pending] = useActionState(createAd, undefined);
  const [eligibleModels, setEligibleModels] = useState<EligibleModel[]>([]);
  const [addBrand, setAddBrand] = useState("");
  const [addModel, setAddModel] = useState("");
  const [isConfidential, setIsConfidential] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);

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

  const inputCls = "w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400";
  const selectCls = `${inputCls} pr-10 appearance-none cursor-pointer`;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="eligibleModels" value={JSON.stringify(eligibleModels)} />
      <input type="hidden" name="isConfidential" value={String(isConfidential)} />
      <input type="hidden" name="autoAccept" value={String(autoAccept)} />

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
              className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-700 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-900 text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm">
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

      {/* Advanced options */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">Options avancées</h2>

        {/* isConfidential */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5">
            <input type="checkbox" className="sr-only peer" checked={isConfidential} onChange={(e) => setIsConfidential(e.target.checked)} />
            <div className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:bg-zinc-700 peer-checked:border-zinc-700 transition-colors flex items-center justify-center">
              {isConfidential && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
              <EyeOff className="w-4 h-4 text-gray-400" /> Image confidentielle
            </div>
            <p className="text-gray-400 text-xs mt-0.5">L&apos;image du visuel sera masquée sur la page publique de l&apos;annonce.</p>
          </div>
        </label>

        {/* autoAccept + maxApplicants */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5">
            <input type="checkbox" className="sr-only peer" checked={autoAccept} onChange={(e) => setAutoAccept(e.target.checked)} />
            <div className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:bg-zinc-700 peer-checked:border-zinc-700 transition-colors flex items-center justify-center">
              {autoAccept && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
              <Zap className="w-4 h-4 text-gray-400" /> Acceptation automatique
            </div>
            <p className="text-gray-400 text-xs mt-0.5">Les candidatures sont acceptées automatiquement jusqu&apos;au nombre limite ci-dessous.</p>
          </div>
        </label>

        {autoAccept && (
          <div className="pl-8">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-400" /> Nombre maximum de conducteurs
            </label>
            <input name="maxApplicants" type="number" min="1" step="1" placeholder="Ex : 50"
              className={`${inputCls} max-w-xs`} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending || eligibleModels.length === 0}
          className="flex-1 sm:flex-none sm:px-8 bg-zinc-700 hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-900 font-semibold py-3 rounded-xl transition-colors shadow-sm">
          {pending ? "Publication…" : "Publier l'annonce"}
        </button>
        <a href="/advertiser/dashboard" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">Annuler</a>
      </div>
    </form>
  );
}
