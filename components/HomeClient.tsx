"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Car, ArrowDown, Shield, TrendingUp, Activity } from "lucide-react";
import { CAR_DATA, getModelsForBrand } from "@/lib/car-data";
import { COUNTRIES } from "@/lib/ad-options";
import AdCard from "./AdCard";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

type Ad = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  pricePerDay: number;
  advertiser: { name: string; companyName: string | null; avatarUrl: string | null };
  eligibleModels: { brand: string; model: string }[];
  modelSelectionMode: string;
  countries: string[];
};

type FuelTickerItem = {
  country: string;
  code: string;
  roundedAveragePrice: number;
  currency: string;
  fallback: boolean;
};

function isModelEligible(ad: Ad, brand: string, model: string): boolean {
  const isListed = ad.eligibleModels.some(
    (m) => m.brand.toLowerCase() === brand.toLowerCase() && m.model.toLowerCase() === model.toLowerCase()
  );
  return ad.modelSelectionMode === "MANUAL" ? isListed : !isListed;
}

type Props = {
  ads: Ad[];
  initialBrand: string | null;
  initialModel: string | null;
  isLoggedIn: boolean;
};

export default function HomeClient({ ads, initialBrand, initialModel, isLoggedIn }: Props) {
  const { t } = useLocale();
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand ?? "");
  const [selectedModel, setSelectedModel] = useState<string>(initialModel ?? "");
  const [selectedAdCountry, setSelectedAdCountry] = useState("");
  const [fuelPrices, setFuelPrices] = useState<FuelTickerItem[]>([]);
  const adsRef = useRef<HTMLDivElement>(null);

  const models = selectedBrand ? getModelsForBrand(selectedBrand) : [];

  const vehicleSelected = Boolean(selectedBrand && selectedModel);
  const compatibleAds =
    selectedBrand && selectedModel
      ? ads.filter((ad) => isModelEligible(ad, selectedBrand, selectedModel))
      : ads;
  const availableCountries = useMemo(
    () =>
      COUNTRIES.filter((country) =>
        compatibleAds.some((ad) => ad.countries.length === 0 || ad.countries.includes(country))
      ),
    [compatibleAds]
  );
  const effectiveSelectedAdCountry =
    selectedAdCountry && availableCountries.includes(selectedAdCountry as (typeof COUNTRIES)[number])
      ? selectedAdCountry
      : "";
  const filteredAds = effectiveSelectedAdCountry
    ? compatibleAds.filter((ad) => ad.countries.length === 0 || ad.countries.includes(effectiveSelectedAdCountry))
    : compatibleAds;
  const visibleAds = vehicleSelected ? filteredAds : ads;

  useEffect(() => {
    let cancelled = false;

    fetch("/api/fuel-prices")
      .then((response) => {
        if (!response.ok) throw new Error("Fuel prices request failed");
        return response.json() as Promise<{ countries?: FuelTickerItem[] }>;
      })
      .then((data) => {
        if (!cancelled) setFuelPrices(data.countries ?? []);
      })
      .catch(() => {
        if (!cancelled) setFuelPrices([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleBrandChange(brand: string) {
    setSelectedBrand(brand);
    setSelectedModel("");
    setSelectedAdCountry("");
  }

  function handleModelChange(model: string) {
    setSelectedModel(model);
    if (model) {
      setTimeout(() => {
        adsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }

  return (
    <main className="flex flex-col">
      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 bg-white">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#f3f4f6 1px, transparent 1px), linear-gradient(90deg, #f3f4f6 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gray glow top-center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gray-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-2xl mx-auto w-full">
          {/* Car icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-zinc-50 border-2 border-zinc-100 rounded-3xl flex items-center justify-center shadow-sm">
              <Car className="w-10 h-10 text-zinc-700" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Car Selector Card — prominent */}
          <div className="bg-white border-2 border-zinc-300 rounded-2xl p-6 sm:p-7 shadow-xl shadow-zinc-100/60">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Car className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <h2 className="font-bold text-gray-900 text-base leading-tight">{t.hero.selectVehicle}</h2>
                <p className="text-gray-400 text-xs">{t.hero.selectVehicleSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">{t.hero.brand}</label>
                <div className="relative group">
                  <select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 transition-all cursor-pointer font-medium shadow-sm hover:border-gray-300"
                  >
                    <option value="">{t.hero.chooseBrand}</option>
                    {CAR_DATA.map((d) => <option key={d.brand} value={d.brand}>{d.brand}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-6 h-6 bg-gray-100 rounded-lg group-focus-within:bg-zinc-100 transition-colors">
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-focus-within:text-zinc-700 transition-colors" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">{t.hero.model}</label>
                <div className="relative group">
                  <select
                    value={selectedModel}
                    onChange={(e) => handleModelChange(e.target.value)}
                    disabled={!selectedBrand}
                    className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 transition-all cursor-pointer font-medium shadow-sm hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:border-gray-200"
                  >
                    <option value="">{selectedBrand ? t.hero.chooseModel : t.hero.brandFirst}</option>
                    {models.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-6 h-6 rounded-lg transition-colors ${selectedBrand ? "bg-gray-100 group-focus-within:bg-zinc-100" : "bg-gray-50"}`}>
                    <ChevronDown className={`w-3.5 h-3.5 transition-colors ${selectedBrand ? "text-gray-500 group-focus-within:text-zinc-700" : "text-gray-300"}`} />
                  </div>
                </div>
              </div>
            </div>

            {selectedBrand && selectedModel ? (
              <div className="mt-4 flex items-center justify-between bg-zinc-50 rounded-xl px-4 py-3 border border-zinc-100">
                <p className="text-gray-600 text-sm">
                  <span className="text-gray-900 font-bold">{filteredAds.length}</span>{" "}
                  {filteredAds.length !== 1 ? t.hero.adsCountPlural : t.hero.adsCountSingular} {t.hero.adsCountFor}{" "}
                  <span className="text-zinc-700 font-semibold">{selectedBrand} {selectedModel}</span>
                </p>
                <button
                  onClick={() => adsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="flex items-center gap-1 text-zinc-700 hover:text-zinc-800 text-sm font-bold transition-colors"
                >
                  {t.hero.see} <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="mt-4 text-gray-400 text-xs text-center">{t.hero.selectBrandThenModel}</p>
            )}
          </div>

          {!isLoggedIn && (
            <p className="mt-4 text-gray-400 text-sm">
              {t.hero.notRegistered}{" "}
              <Link href="/register" className="text-zinc-700 hover:text-zinc-800 font-semibold">
                {t.hero.createAccount}
              </Link>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => adsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce rounded-full p-3 text-gray-300 transition-colors hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700/20"
          aria-label="Voir les annonces"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </section>

      <section className="overflow-hidden border-y border-gray-800 bg-gray-950 text-white" aria-label="Prix moyens de l'essence en Europe">
        <div className="flex min-h-16 items-center">
          <div className="relative z-10 flex h-16 shrink-0 items-center gap-2 border-r border-white/10 bg-gray-950 px-4 sm:px-6">
            <Activity className="h-4 w-4 text-zinc-700" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-200">Essence Europe</span>
          </div>
          <div className="fuel-ticker-mask min-w-0 flex-1">
            <div className={`fuel-ticker-track flex w-max items-center gap-3 py-3 ${fuelPrices.length === 0 ? "fuel-ticker-paused" : ""}`}>
              {(fuelPrices.length > 0 ? [...fuelPrices, ...fuelPrices] : []).map((fuel, index) => (
                <div key={`${fuel.code}-${index}`} className="flex h-10 items-center gap-2 rounded border border-white/10 bg-white/[0.04] px-3 text-sm tabular-nums">
                  <span className="text-gray-300">{fuel.country}</span>
                  <span className="font-bold text-zinc-700">
                    {fuel.roundedAveragePrice.toFixed(2)} {fuel.currency}/L
                  </span>
                  {fuel.fallback && <span className="text-[10px] uppercase tracking-wide text-gray-500">secours</span>}
                </div>
              ))}
              {fuelPrices.length === 0 && (
                <div className="px-4 text-sm text-gray-400">Chargement des prix carburant...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="comment-ca-marche" className="py-20 px-4 bg-gray-50 border-t border-gray-100 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">{t.howItWorks.title}</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[Car, Shield, TrendingUp].map((Icon, i) => {
              const step = t.howItWorks.steps[i];
              return (
                <div key={step.title} className="relative">
                  <div className="text-6xl font-black text-gray-100 mb-3 leading-none">{String(i + 1).padStart(2, "0")}</div>
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center mb-4 border border-zinc-100">
                    <Icon className="w-5 h-5 text-zinc-700" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ADS SECTION ── */}
      <section ref={adsRef} className="py-20 px-4 bg-white border-t border-gray-100 min-h-screen scroll-mt-16" id="annonces">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedBrand && selectedModel
                  ? `${t.ads.adsFor} ${selectedBrand} ${selectedModel}`
                  : t.ads.allAds}
              </h2>
              <p className="text-gray-500">
                {selectedBrand && selectedModel
                  ? `${visibleAds.length} ${visibleAds.length !== 1 ? t.ads.campaignPlural : t.ads.campaignSingular} ${visibleAds.length !== 1 ? t.ads.compatiblePlural : t.ads.compatibleSingular}`
                  : t.ads.selectVehicleToFilter}
              </p>
            </div>
            {selectedBrand && selectedModel ? (
              <div className="relative self-start sm:self-end">
                <select
                  value={effectiveSelectedAdCountry}
                  onChange={(e) => setSelectedAdCountry(e.target.value)}
                  className="w-56 appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm font-semibold text-gray-800 shadow-sm transition-all hover:border-orange-300 focus:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700/15"
                >
                  <option value="">Tous les pays</option>
                  {availableCountries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            ) : (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-sm text-zinc-700 hover:text-zinc-800 font-semibold border border-zinc-300 hover:border-orange-300 px-4 py-2 rounded-xl transition-all self-start bg-zinc-50"
              >
                {t.ads.selectMyVehicle}
              </button>
            )}
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-20">
              <Car className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">{t.ads.noAdsAvailable}</p>
              <p className="text-gray-300 text-sm mt-2">{t.ads.comeBackSoon}</p>
            </div>
          ) : visibleAds.length === 0 && selectedBrand && selectedModel ? (
            <div className="text-center py-20">
              <Car className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {t.ads.noCompatiblePrefix} {selectedBrand} {selectedModel}
                {effectiveSelectedAdCountry ? ` en ${effectiveSelectedAdCountry}` : ""}
              </p>
              <p className="text-gray-300 text-sm mt-2">{t.ads.noCompatibleSoon}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} userBrand={selectedBrand} userModel={selectedModel} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
