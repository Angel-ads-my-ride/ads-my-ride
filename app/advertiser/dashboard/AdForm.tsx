"use client";

import { type ReactNode, useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronLeft, ChevronRight, Info, EyeOff, Users, Zap, Globe, Car as CarIcon, CalendarRange, Calculator } from "lucide-react";
import { saveAd } from "@/app/actions/ads";
import { CAR_DATA, getModelsForBrand } from "@/lib/car-data";
import {
  COUNTRIES,
  FUEL_PRICE_PER_LITER,
  AVERAGE_CONSUMPTION_L_PER_100KM,
  ESTIMATOR_DAILY_RATE_PER_DRIVER,
  ESTIMATOR_FLAT_COST_PER_DRIVER,
} from "@/lib/ad-options";
import { FRANCE_DEPARTMENTS } from "@/lib/france-departments-map";
import CarVisualPreview from "./CarVisualPreview";
import FranceDepartmentMap from "./FranceDepartmentMap";

type EligibleModel = { brand: string; model: string };
type DateField = "start" | "end";

const FRANCE_REGIONS = [
  { name: "Auvergne-Rhône-Alpes", codes: ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"] },
  { name: "Bourgogne-Franche-Comté", codes: ["21", "25", "39", "58", "70", "71", "89", "90"] },
  { name: "Bretagne", codes: ["22", "29", "35", "56"] },
  { name: "Centre-Val de Loire", codes: ["18", "28", "36", "37", "41", "45"] },
  { name: "Corse", codes: ["2A", "2B"] },
  { name: "Grand Est", codes: ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"] },
  { name: "Hauts-de-France", codes: ["02", "59", "60", "62", "80"] },
  { name: "Île-de-France", codes: ["75", "77", "78", "91", "92", "93", "94", "95"] },
  { name: "Normandie", codes: ["14", "27", "50", "61", "76"] },
  { name: "Nouvelle-Aquitaine", codes: ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"] },
  { name: "Occitanie", codes: ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"] },
  { name: "Pays de la Loire", codes: ["44", "49", "53", "72", "85"] },
  { name: "Provence-Alpes-Côte d'Azur", codes: ["04", "05", "06", "13", "83", "84"] },
] as const;

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

function toLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(value: string, days: number) {
  const date = toLocalDate(value);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

function formatDateLabel(value: string) {
  if (!value) return "Choisir une date";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(toLocalDate(value));
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(date);
}

function getCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: totalDays }, (_, index) => new Date(year, month, index + 1)),
  ];
}

function SmoothCollapse({
  open,
  children,
  className = "",
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden={!open}
      className={`grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out ${
        open ? "grid-rows-[1fr] opacity-100 translate-y-0" : "grid-rows-[0fr] opacity-0 -translate-y-1 pointer-events-none"
      } ${className}`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

function CampaignCalendar({
  activeField,
  monthDate,
  startDate,
  endDate,
  onMonthChange,
  onSelectDate,
}: {
  activeField: DateField;
  monthDate: Date;
  startDate: string;
  endDate: string;
  onMonthChange: (date: Date) => void;
  onSelectDate: (field: DateField, value: string) => void;
}) {
  const minEndDate = startDate ? addDays(startDate, 7) : "";
  const days = getCalendarDays(monthDate);
  const weekDays = ["L", "M", "M", "J", "V", "S", "D"];

  function moveMonth(direction: -1 | 1) {
    onMonthChange(new Date(monthDate.getFullYear(), monthDate.getMonth() + direction, 1));
  }

  function isDateDisabled(value: string) {
    return activeField === "end" && (!startDate || value < minEndDate);
  }

  function isInRange(value: string) {
    return !!startDate && !!endDate && value > startDate && value < endDate;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => moveMonth(-1)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800"
          aria-label="Mois précédent">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-semibold text-gray-900 capitalize">{formatMonthLabel(monthDate)}</div>
        <button type="button" onClick={() => moveMonth(1)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800"
          aria-label="Mois suivant">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-gray-400">
        {weekDays.map((day, index) => <div key={`${day}-${index}`}>{day}</div>)}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="aspect-square" />;

          const value = toIsoDate(day);
          const disabled = isDateDisabled(value);
          const isStart = value === startDate;
          const isEnd = value === endDate;
          const selected = isStart || isEnd;

          return (
            <button key={value} type="button" disabled={disabled} onClick={() => onSelectDate(activeField, value)}
              className={`relative aspect-square rounded-lg text-sm font-medium transition-all ${
                selected
                  ? "bg-zinc-700 text-gray-900 shadow-sm"
                  : isInRange(value)
                    ? "bg-amber-50 text-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
              } ${disabled ? "cursor-not-allowed text-gray-300 hover:bg-transparent" : ""}`}>
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
        {activeField === "end" && startDate && (
          <p className="mb-1 font-medium text-gray-700">Date de fin disponible à partir du {formatDateLabel(minEndDate)}.</p>
        )}
        {startDate && endDate ? (
          <p><span className="font-semibold text-gray-900">{Math.round((toLocalDate(endDate).getTime() - toLocalDate(startDate).getTime()) / 86400000)} jours</span> sélectionnés, du {formatDateLabel(startDate)} au {formatDateLabel(endDate)}.</p>
        ) : (
          <p>Sélectionnez un début puis une fin pour voir la durée de campagne.</p>
        )}
      </div>
    </div>
  );
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
  const [expandedCountry, setExpandedCountry] = useState<string | null>(
    ad?.countries.includes("France") && ad.departments.length > 0 ? "France" : null
  );
  const [vehicleConditions] = useState<string[]>(ad?.vehicleConditions ?? []);
  const [modelSelectionMode, setModelSelectionMode] = useState(ad?.modelSelectionMode ?? "ALL_EXCEPT");
  const [startDate, setStartDate] = useState(toDateInputValue(ad?.startDate));
  const [endDate, setEndDate] = useState(toDateInputValue(ad?.endDate));
  const [activeDateField, setActiveDateField] = useState<DateField>("start");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initialDate = toDateInputValue(ad?.startDate) || toDateInputValue(ad?.endDate);
    return initialDate ? toLocalDate(initialDate) : new Date();
  });
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

  function toggleCountry(country: string) {
    const nextCountries = countries.includes(country)
      ? countries.filter((c) => c !== country)
      : [...countries, country];

    setCountries(nextCountries);

    if (!nextCountries.includes(country)) {
      setExpandedCountry((current) => (current === country ? null : current));
    }

    if (country === "France" && !nextCountries.includes("France")) {
      setDepartments([]);
    }
  }

  function toggleFranceRegion(codes: readonly string[]) {
    if (departments.length === 0) {
      setDepartments([...codes]);
      return;
    }

    const allRegionDepartmentsSelected = codes.every((code) => departments.includes(code));

    if (allRegionDepartmentsSelected) {
      setDepartments(departments.filter((code) => !codes.includes(code)));
      return;
    }

    setDepartments([...departments, ...codes.filter((code) => !departments.includes(code))]);
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

  const isAllFranceTargeted = departments.length === 0 || departments.length === FRANCE_DEPARTMENTS.length;
  const franceCoverageLabel = isAllFranceTargeted
    ? "Tous"
    : `${departments.length} département${departments.length !== 1 ? "s" : ""}`;

  const campaignDays = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = toLocalDate(startDate);
    const end = toLocalDate(endDate);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 7 ? diff : null;
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

  const estimatedVehicleCount = useMemo(() => {
    if (!estimate) return "";
    const budget = parseFloat(totalBudget);
    return budget > 0 ? String(Math.floor(budget / estimate.costPerVehicle)) : "";
  }, [estimate, totalBudget]);

  const estimatedTotalBudget = useMemo(() => {
    if (!estimate) return "";
    const count = parseInt(vehicleCount, 10);
    return count > 0 ? String(Math.round(count * estimate.costPerVehicle * 100) / 100) : "";
  }, [estimate, vehicleCount]);

  const displayedTotalBudget = budgetSource === "vehicles" ? estimatedTotalBudget : totalBudget;
  const displayedVehicleCount = budgetSource === "budget" ? estimatedVehicleCount : vehicleCount;

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

  function openDatePicker(field: DateField) {
    setActiveDateField(field);
    setDatePickerOpen(true);
    const targetDate = field === "start" ? startDate : endDate || (startDate ? addDays(startDate, 7) : "");
    if (targetDate) setCalendarMonth(toLocalDate(targetDate));
  }

  function handleCalendarSelect(field: DateField, value: string) {
    if (field === "start") {
      const minEnd = addDays(value, 7);
      setStartDate(value);
      if (!endDate || endDate < minEnd) {
        setEndDate(minEnd);
      }
      setActiveDateField("end");
      setCalendarMonth(toLocalDate(minEnd));
      return;
    }

    setEndDate(value);
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

      {/* Visual preview */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900">Visuel et aperçu</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(360px,1.2fr)] gap-4 sm:gap-5 lg:items-start">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Importer le visuel</label>
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`${inputCls} file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:text-zinc-700 file:text-sm file:font-medium`}
            />
          </div>

          <CarVisualPreview imageSrc={imagePreview} />
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm">
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
      </div>

      {/* Campaign dates */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
        <input type="hidden" name="startDate" value={startDate} />
        <input type="hidden" name="endDate" value={endDate} />

        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-1.5"><CalendarRange className="w-4 h-4 text-gray-400" /> Dates de la campagne</h2>
          <p className="text-gray-400 text-xs mt-1">Durée minimum : 1 semaine.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Début *</label>
            <button type="button" onClick={() => openDatePicker("start")}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                datePickerOpen && activeDateField === "start" ? "border-zinc-700 bg-amber-50 ring-2 ring-zinc-700/15" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}>
              <span className="block text-xs font-medium text-gray-400">Date de début</span>
              <span className="mt-0.5 block text-sm font-semibold text-gray-900">{formatDateLabel(startDate)}</span>
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fin *</label>
            <button type="button" onClick={() => openDatePicker("end")}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                datePickerOpen && activeDateField === "end" ? "border-zinc-700 bg-amber-50 ring-2 ring-zinc-700/15" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}>
              <span className="block text-xs font-medium text-gray-400">Date de fin</span>
              <span className="mt-0.5 block text-sm font-semibold text-gray-900">{formatDateLabel(endDate)}</span>
            </button>
          </div>
        </div>
        <SmoothCollapse open={datePickerOpen}>
          <CampaignCalendar
            activeField={activeDateField}
            monthDate={calendarMonth}
            startDate={startDate}
            endDate={endDate}
            onMonthChange={setCalendarMonth}
            onSelectDate={handleCalendarSelect}
          />
        </SmoothCollapse>
        {startDate && endDate && campaignDays === null && (
          <p className="text-red-600 text-xs">La campagne doit durer au moins 1 semaine.</p>
        )}
        {campaignDays !== null && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-gray-700">
            <span className="font-semibold text-gray-900">{campaignDays} jours</span>
            <span className="text-xs text-gray-500">du {formatDateLabel(startDate)} au {formatDateLabel(endDate)}</span>
          </div>
        )}
      </div>

      {/* Country */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-1.5"><Globe className="w-4 h-4 text-gray-400" /> Pays concernés</h2>
          <p className="text-gray-400 text-xs mt-1">Laissez vide pour cibler tous les pays.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map((c) => (
            <label key={c} className={checkboxCls}>
              <input type="checkbox" className="accent-zinc-700" checked={countries.includes(c)} onChange={() => toggleCountry(c)} />
              {c}
            </label>
          ))}
        </div>

        {countries.length > 0 && (
          <div className="border-t border-gray-100 pt-4 space-y-2">
            {countries.map((country) => {
              const hasDetail = country === "France";
              const isExpanded = expandedCountry === country;
              const coverageLabel = country === "France" ? franceCoverageLabel : "Tous";

              return (
                <div key={country} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  {hasDetail ? (
                    <button
                      type="button"
                      onClick={() => setExpandedCountry(isExpanded ? null : country)}
                      aria-expanded={isExpanded}
                      className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="font-medium text-gray-900">{country}</span>
                        <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
                          {coverageLabel}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                        Détail
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </span>
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                      <span className="font-medium text-gray-900">{country}</span>
                      <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
                        Tous
                      </span>
                    </div>
                  )}

                  <SmoothCollapse open={hasDetail && isExpanded}>
                    <div className="border-t border-gray-200 bg-white p-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Régions et départements</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {isAllFranceTargeted
                              ? "Toute la France est ciblée."
                              : `${departments.length} département${departments.length !== 1 ? "s" : ""} ciblé${departments.length !== 1 ? "s" : ""}.`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDepartments([])}
                          className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                            isAllFranceTargeted
                              ? "border-zinc-700 bg-zinc-50 text-zinc-800"
                              : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          Tous
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {FRANCE_REGIONS.map((region) => {
                          const isRegionSelected = departments.length > 0 && region.codes.every((code) => departments.includes(code));

                          return (
                            <button
                              key={region.name}
                              type="button"
                              onClick={() => toggleFranceRegion(region.codes)}
                              className={`min-h-14 rounded-lg border px-3 py-2 text-left transition-colors ${
                                isRegionSelected
                                  ? "border-zinc-700 bg-zinc-50 text-zinc-800"
                                  : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <span className="block text-sm font-medium leading-tight">{region.name}</span>
                              <span className="block text-[11px] text-gray-400 mt-0.5">
                                {region.codes.length} départements
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <FranceDepartmentMap selected={departments} onChange={setDepartments} />
                    </div>
                  </SmoothCollapse>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Eligible vehicles */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm">
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

        <div className="space-y-0">
          <SmoothCollapse open={modelSelectionMode === "ALL_EXCEPT"}>
            <div>
              <p className="text-gray-400 text-xs mb-2">Toutes les marques et tous les modèles sont acceptés.</p>
              <button type="button" onClick={() => setShowAllVehicles((v) => !v)}
                disabled={modelSelectionMode !== "ALL_EXCEPT"}
                className="text-sm text-zinc-600 hover:text-zinc-800 font-medium underline underline-offset-2">
                {showAllVehicles ? "Masquer" : "Voir"} la liste complète des véhicules pris en charge
              </button>
              <SmoothCollapse open={showAllVehicles && modelSelectionMode === "ALL_EXCEPT"}>
                <div className="mt-3 max-h-64 overflow-y-auto space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50">
                  {CAR_DATA.map((d) => (
                    <div key={d.brand}>
                      <p className="text-gray-700 font-semibold text-sm mb-1">{d.brand}</p>
                      <p className="text-gray-500 text-xs">{d.models.join(", ")}</p>
                    </div>
                  ))}
                </div>
              </SmoothCollapse>
            </div>
          </SmoothCollapse>

          <SmoothCollapse open={modelSelectionMode === "MANUAL"}>
            <div className="space-y-5">
              <p className="text-gray-400 text-xs">
                Aucun modèle n&apos;est accepté par défaut. Ajoutez ci-dessous, un par un, les seuls modèles que vous acceptez.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <select value={addBrand} onChange={(e) => { setAddBrand(e.target.value); setAddModel(""); }} disabled={modelSelectionMode !== "MANUAL"} className={selectCls}>
                    <option value="">-- Marque --</option>
                    {CAR_DATA.map((d) => <option key={d.brand} value={d.brand}>{d.brand}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select value={addModel} onChange={(e) => setAddModel(e.target.value)} disabled={!addBrand || modelSelectionMode !== "MANUAL"}
                    className={`${selectCls} disabled:opacity-40 disabled:cursor-not-allowed`}>
                    <option value="">-- Modèle --</option>
                    {addModelsForBrand.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={addEligibleModel} disabled={!addBrand || !addModel || modelSelectionMode !== "MANUAL"}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-700 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-900 text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm">
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                  <button type="button" onClick={addAllModels} disabled={modelSelectionMode !== "MANUAL"}
                    title={addBrand ? "Ajouter tous les modèles de cette marque" : "Ajouter tous les véhicules, toutes marques confondues"}
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
                  <p className="text-gray-400 text-xs">
                    {eligibleModels.length} modèle{eligibleModels.length !== 1 ? "s" : ""} sélectionné{eligibleModels.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          </SmoothCollapse>
        </div>
      </div>

      {/* Budget estimator */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm">
        <input type="hidden" name="totalBudget" value={displayedTotalBudget} />
        <input type="hidden" name="pricePerDay" value={ESTIMATOR_DAILY_RATE_PER_DRIVER} />

        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-1.5"><Calculator className="w-4 h-4 text-gray-400" /> Estimation du budget</h2>
          <p className="text-gray-400 text-xs mt-1">Renseignez d&apos;abord les dates de la campagne ci-dessus, puis le budget ou le nombre de véhicules — l&apos;autre se calcule automatiquement.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget total *</label>
            <div className="relative">
              <input type="text" inputMode="decimal" required value={formatBudgetDisplay(displayedTotalBudget)}
                onChange={(e) => handleBudgetChange(e.target.value)} placeholder="5 000"
                className={`${inputCls} pr-10`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
            </div>
          </div>
          <div className="flex items-center justify-center text-xl font-bold text-gray-300 sm:pb-3">=</div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de véhicules</label>
            <input type="text" inputMode="numeric" value={displayedVehicleCount}
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
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm">
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

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
        <button type="submit" name="intent" value="publish" disabled={pending || !isCertified}
          title={!isCertified ? "Votre compte doit être certifié avant de pouvoir publier une annonce." : undefined}
          className="w-full sm:w-auto sm:px-8 bg-zinc-700 hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-900 font-semibold py-3 rounded-xl transition-all duration-150 shadow-sm cursor-pointer active:scale-[0.98]">
          {pending ? "Enregistrement…" : "Publier l'annonce"}
        </button>
        <button type="submit" name="intent" value="draft" disabled={pending}
          className="w-full sm:w-auto sm:px-6 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 font-semibold py-3 rounded-xl transition-all duration-150 border border-gray-200 cursor-pointer active:scale-[0.98]">
          {pending ? "Enregistrement…" : "Enregistrer comme brouillon"}
        </button>
        <button type="button" onClick={onCancel} className="w-full sm:w-auto text-gray-500 hover:text-gray-700 text-sm transition-colors rounded-xl py-2 cursor-pointer">Annuler</button>
      </div>
    </form>
  );
}
