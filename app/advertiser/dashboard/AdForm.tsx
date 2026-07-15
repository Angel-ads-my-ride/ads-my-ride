"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Trash2, ChevronDown, Info, EyeOff, Users, Zap, Globe, Car as CarIcon, CalendarRange, Calculator } from "lucide-react";
import { saveAd } from "@/app/actions/ads";
import { CAR_DATA, getModelsForBrand } from "@/lib/car-data";
import {
  COUNTRIES,
  VEHICLE_CONDITIONS,
  FUEL_PRICE_PER_LITER,
  AVERAGE_CONSUMPTION_L_PER_100KM,
  ESTIMATOR_DAILY_RATE_PER_DRIVER,
  ESTIMATOR_FLAT_COST_PER_DRIVER,
} from "@/lib/ad-options";
import FranceDepartmentMap from "./FranceDepartmentMap";

type EligibleModel = { brand: string; model: string };

export type ExistingAd = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  pricePerDay: number;
  totalBudget: number;
  remainingBudget: number;
  isConfidential: boolean;
  autoAccept: boolean;
  maxApplicants: number | null;
  countries: string[];
  departments: string[];
  vehicleConditions: string[];
  modelSelectionMode: string;
  startDate: string | null;
  endDate: string | null;
  eligibleModels: EligibleModel[];
};

function toDateInputValue(value: string | null | undefined) {
  if (!value) return "";
  return value.slice(0, 10);
}

export default function AdForm({
  ad,
  isCertified,
  onSaved,
  onCancel,
}: {
  ad?: ExistingAd;
  isCertified: boolean;
  onSaved: (isDraft: boolean) => void;
  onCancel: () => void;
}) {
  const [state, action, pending] = useActionState(saveAd, undefined);
  const [eligibleModels, setEligibleModels] = useState<EligibleModel[]>(ad?.eligibleModels ?? []);
  const [addBrand, setAddBrand] = useState("");
  const [addModel, setAddModel] = useState("");
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const [isConfidential, setIsConfidential] = useState(ad?.isConfidential ?? false);
  const [autoAccept, setAutoAccept] = useState(ad?.autoAccept ?? false);
  const [imagePreview, setImagePreview] = useState<string | null>(ad?.imageUrl ?? null);
  const [countries, setCountries] = useState<string[]>(ad?.countries ?? []);
  const [departments, setDepartments] = useState<string[]>(ad?.departments ?? []);
  const [vehicleConditions, setVehicleConditions] = useState<string[]>(ad?.vehicleConditions ?? []);
  const [modelSelectionMode, setModelSelectionMode] = useState(ad?.modelSelectionMode ?? "ALL_EXCEPT");
  const [startDate, setStartDate] = useState(toDateInputValue(ad?.startDate));
  const [endDate, setEndDate] = useState(toDateInputValue(ad?.endDate));
  const [totalBudget, setTotalBudget] = useState(ad?.totalBudget ? String(ad.totalBudget) : "");
  const [vehicleCount, setVehicleCount] = useState("");
  const [budgetSource, setBudgetSource] = useState<"budget" | "vehicles">("budget");

  useEffect(() => {
    if (state?.success) onSaved(!!state.isDraft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function toggleInArray(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const addModelsForBrand = getModelsForBrand(addBrand);

  function addEligibleModel() {
    if (!addBrand || !addModel) return;
    if (eligibleModels.some((m) => m.brand === addBrand && m.model === addModel)) return;
    setEligibleModels([...eligibleModels, { brand: addBrand, model: addModel }]);
    setAddModel("");
  }

  function addAllModels() {
    const source = addBrand
      ? [{ brand: addBrand, models: getModelsForBrand(addBrand) }]
      : CAR_DATA;
    const newModels = source.flatMap((d) =>
      d.models
        .filter((m) => !eligibleModels.some((e) => e.brand === d.brand && e.model === m))
        .map((m) => ({ brand: d.brand, model: m }))
    );
    setEligibleModels([...eligibleModels, ...newModels]);
  }

  function removeModel(idx: number) {
    setEligibleModels(eligibleModels.filter((_, i) => i !== idx));
  }

  const groupedModels = eligibleModels.reduce<Record<string, string[]>>((acc, m) => {
    if (!acc[m.brand]) acc[m.brand] = [];
    acc[m.brand].push(m.model);
    return acc;
  }, {});

  const campaignDays = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  }, [startDate, endDate]);

  const estimatorCountry = (countries[0] as keyof typeof FUEL_PRICE_PER_LITER) ?? "France";

  const estimate = useMemo(() => {
    if (campaignDays === null) return null;

    const days = campaignDays;
    const costPerVehicle = ESTIMATOR_DAILY_RATE_PER_DRIVER * days + ESTIMATOR_FLAT_COST_PER_DRIVER;

    const fuelPrice = FUEL_PRICE_PER_LITER[estimatorCountry] ?? FUEL_PRICE_PER_LITER.France;
    const fuelCostPerKm = (AVERAGE_CONSUMPTION_L_PER_100KM / 100) * fuelPrice;
    const minKmPerDay = ESTIMATOR_DAILY_RATE_PER_DRIVER / (4 * fuelCostPerKm);
    const maxKmPerDay = ESTIMATOR_DAILY_RATE_PER_DRIVER / (2 * fuelCostPerKm);

    return { days, costPerVehicle, fuelPrice, fuelCostPerKm, minKmPerDay, maxKmPerDay };
  }, [campaignDays, estimatorCountry]);

  // Budget total and vehicle count are two views of the same number — editing
  // either one recomputes the other from the per-vehicle cost.
  useEffect(() => {
    if (!estimate) return;
    if (budgetSource === "budget") {
      const budget = parseFloat(totalBudget);
      setVehicleCount(budget > 0 ? String(Math.floor(budget / estimate.costPerVehicle)) : "");
    } else {
      const count = parseInt(vehicleCount, 10);
      if (count > 0) {
        setTotalBudget(String(Math.round(count * estimate.costPerVehicle * 100) / 100));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalBudget, vehicleCount, estimate?.costPerVehicle, budgetSource]);

  function formatBudgetDisplay(raw: string) {
    if (!raw) return "";
    const [intPart, decPart] = raw.split(".");
    const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decPart !== undefined ? `${withSpaces}.${decPart}` : withSpaces;
  }

  function handleBudgetChange(raw: string) {
    setBudgetSource("budget");
    setTotalBudget(raw.replace(/[^\d.]/g, ""));
  }

  function handleVehicleCountChange(raw: string) {
    setBudgetSource("vehicles");
    setVehicleCount(raw.replace(/[^\d]/g, ""));
  }

  const inputCls = "w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400";
  const selectCls = `${inputCls} pr-10 appearance-none cursor-pointer`;
  const checkboxCls = "flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-pointer transition-colors";

  return (
    <form action={action} className="space-y-6">
      {ad && <input type="hidden" name="adId" value={ad.id} />}
      <input type="hidden" name="eligibleModels" value={JSON.stringify(eligibleModels)} />
      <input type="hidden" name="isConfidential" value={String(isConfidential)} />
      <input type="hidden" name="autoAccept" value={String(autoAccept)} />
      <input type="hidden" name="countries" value={JSON.stringify(countries)} />
      <input type="hidden" name="departments" value={JSON.stringify(departments)} />
      <input type="hidden" name="vehicleConditions" value={JSON.stringify(vehicleConditions)} />
      <input type="hidden" name="modelSelectionMode" value={modelSelectionMode} />

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}

      {/* Basic info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900">Informations de la campagne</h2>
          <p className="text-gray-400 text-xs mt-1">Ces informations sont affichées telles quelles aux conducteurs sur la page publique de l&apos;annonce.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre de l&apos;annonce *</label>
          <input name="title" type="text" required defaultValue={ad?.title} placeholder="Ex : Campagne été 2025 — Ma Marque" className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
          <textarea name="description" required rows={4} defaultValue={ad?.description} placeholder="Décrivez votre campagne, le visuel, les conditions…"
            className={`${inputCls} resize-none`} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Image / visuel <span className="text-gray-400 font-normal">(optionnel, 5 Mo max)</span>
          </label>
          <input name="imageFile" type="file" accept="image/*" onChange={handleImageChange} className={`${inputCls} file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:text-zinc-700 file:text-sm file:font-medium`} />
          {imagePreview && (
            <img src={imagePreview} alt="Aperçu" className="mt-3 w-full max-h-56 object-cover rounded-xl border border-gray-200" />
          )}
        </div>
      </div>

      {/* Campaign dates */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-1.5"><CalendarRange className="w-4 h-4 text-gray-400" /> Dates de la campagne</h2>
          <p className="text-gray-400 text-xs mt-1">Durée minimum : 1 semaine.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Début *</label>
            <input name="startDate" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fin *</label>
            <input name="endDate" type="date" required value={endDate}
              min={startDate ? new Date(new Date(startDate).getTime() + 7 * 86400000).toISOString().slice(0, 10) : undefined}
              onChange={(e) => setEndDate(e.target.value)} className={inputCls} />
          </div>
        </div>
        {startDate && endDate && campaignDays === null && (
          <p className="text-red-600 text-xs">La campagne doit durer au moins 1 semaine.</p>
        )}
        {campaignDays !== null && (
          <p className="text-gray-400 text-xs">Durée : {campaignDays} jours.</p>
        )}
      </div>

      {/* Country */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-1.5"><Globe className="w-4 h-4 text-gray-400" /> Pays concernés</h2>
          <p className="text-gray-400 text-xs mt-1">Laissez vide pour cibler tous les pays.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map((c) => (
            <label key={c} className={checkboxCls}>
              <input type="checkbox" className="accent-zinc-700" checked={countries.includes(c)} onChange={() => toggleInArray(countries, setCountries, c)} />
              {c}
            </label>
          ))}
        </div>

        {countries.includes("France") && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Départements ciblés (France)</p>
            <p className="text-gray-400 text-xs mb-3">Cliquez sur les départements à cibler. Aucune sélection = tous les départements.</p>
            <FranceDepartmentMap selected={departments} onChange={setDepartments} />
          </div>
        )}
      </div>

      {/* Eligible vehicles */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-1.5"><CarIcon className="w-4 h-4 text-gray-400" /> Véhicules éligibles</h2>
          <p className="text-gray-400 text-xs mt-1">Choisissez comment définir les véhicules acceptés.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-1.5">
          <button type="button" onClick={() => setModelSelectionMode("ALL_EXCEPT")}
            className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${modelSelectionMode === "ALL_EXCEPT" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Tous les véhicules
          </button>
          <button type="button" onClick={() => setModelSelectionMode("MANUAL")}
            className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${modelSelectionMode === "MANUAL" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Choix manuel
          </button>
        </div>

        {modelSelectionMode === "ALL_EXCEPT" ? (
          <div>
            <p className="text-gray-400 text-xs mb-2">Toutes les marques et tous les modèles sont acceptés.</p>
            <button type="button" onClick={() => setShowAllVehicles((v) => !v)}
              className="text-sm text-zinc-600 hover:text-zinc-800 font-medium underline underline-offset-2">
              {showAllVehicles ? "Masquer" : "Voir"} la liste complète des véhicules pris en charge
            </button>
            {showAllVehicles && (
              <div className="mt-3 max-h-64 overflow-y-auto space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50">
                {CAR_DATA.map((d) => (
                  <div key={d.brand}>
                    <p className="text-gray-700 font-semibold text-sm mb-1">{d.brand}</p>
                    <p className="text-gray-500 text-xs">{d.models.join(", ")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-xs">
              Aucun modèle n&apos;est accepté par défaut. Ajoutez ci-dessous, un par un, les seuls modèles que vous acceptez.
            </p>

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
                <button type="button" onClick={addAllModels}
                  title={addBrand ? "Ajouter tous les modèles de cette marque" : "Ajouter tous les véhicules, toutes marques confondues"}
                  className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-xl transition-colors border border-gray-200">
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
                <p className="text-gray-400 text-xs">
                  {eligibleModels.length} modèle{eligibleModels.length !== 1 ? "s" : ""} sélectionné{eligibleModels.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </>
        )}

        {/* Vehicle condition sub-section */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-1">État du véhicule accepté</p>
          <p className="text-gray-400 text-xs mb-3">Laissez vide pour accepter tous les états.</p>
          <div className="flex flex-wrap gap-2">
            {VEHICLE_CONDITIONS.map((c) => (
              <label key={c.value} className={checkboxCls}>
                <input type="checkbox" className="accent-zinc-700" checked={vehicleConditions.includes(c.value)} onChange={() => toggleInArray(vehicleConditions, setVehicleConditions, c.value)} />
                {c.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Budget estimator */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <input type="hidden" name="totalBudget" value={totalBudget} />
        <input type="hidden" name="pricePerDay" value={ESTIMATOR_DAILY_RATE_PER_DRIVER} />

        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-1.5"><Calculator className="w-4 h-4 text-gray-400" /> Estimation du budget</h2>
          <p className="text-gray-400 text-xs mt-1">Renseignez d&apos;abord les dates de la campagne ci-dessus, puis le budget ou le nombre de véhicules — l&apos;autre se calcule automatiquement.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget total *</label>
            <div className="relative">
              <input type="text" inputMode="decimal" required value={formatBudgetDisplay(totalBudget)}
                onChange={(e) => handleBudgetChange(e.target.value)} placeholder="5 000"
                className={`${inputCls} pr-10`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
            </div>
          </div>
          <div className="flex items-center justify-center text-xl font-bold text-gray-300 sm:pb-3">=</div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de véhicules</label>
            <input type="text" inputMode="numeric" value={vehicleCount}
              onChange={(e) => handleVehicleCountChange(e.target.value)} placeholder="—"
              className={inputCls} />
          </div>
        </div>

        {estimate === null ? (
          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />
            <span>Renseignez des dates de campagne valides (1 semaine minimum) ci-dessus pour voir l&apos;estimation.</span>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl p-3">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
            <span>
              Estimation basée sur un coût moyen par véhicule de {ESTIMATOR_DAILY_RATE_PER_DRIVER.toFixed(2)}€/jour + {ESTIMATOR_FLAT_COST_PER_DRIVER}€ fixe,
              sur {estimate.days} jour{estimate.days !== 1 ? "s" : ""} (durée de votre campagne), soit {estimate.costPerVehicle.toFixed(2)}€ par véhicule.
              La campagne se met en pause automatiquement quand le budget total est atteint. Kilométrage conseillé par jour et par véhicule : environ {Math.round(estimate.minKmPerDay)}
              –{Math.round(estimate.maxKmPerDay)} km (la rémunération journalière doit couvrir entre 2 et 4 fois le coût en carburant, sur la base du prix de l&apos;essence
              en {estimatorCountry} ≈ {estimate.fuelPrice.toFixed(2)}€/L et d&apos;une consommation moyenne de {AVERAGE_CONSUMPTION_L_PER_100KM}L/100km).
            </span>
          </div>
        )}
      </div>

      {/* Advanced options */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">Options avancées</h2>

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
            <input name="maxApplicants" type="number" min="1" step="1" defaultValue={ad?.maxApplicants ?? undefined} placeholder="Ex : 50"
              className={`${inputCls} max-w-xs`} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" name="intent" value="publish" disabled={pending || !isCertified}
          title={!isCertified ? "Votre compte doit être certifié avant de pouvoir publier une annonce." : undefined}
          className="flex-1 sm:flex-none sm:px-8 bg-zinc-700 hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-900 font-semibold py-3 rounded-xl transition-colors shadow-sm">
          {pending ? "Enregistrement…" : "Publier l'annonce"}
        </button>
        <button type="submit" name="intent" value="draft" disabled={pending}
          className="flex-1 sm:flex-none sm:px-6 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 font-semibold py-3 rounded-xl transition-colors border border-gray-200">
          {pending ? "Enregistrement…" : "Enregistrer comme brouillon"}
        </button>
        <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700 text-sm transition-colors">Annuler</button>
      </div>
    </form>
  );
}
