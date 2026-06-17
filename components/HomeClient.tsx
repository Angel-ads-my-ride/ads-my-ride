"use client";

import { useState, useRef } from "react";
import { ChevronDown, Car, ArrowDown, Shield, TrendingUp } from "lucide-react";
import { CAR_DATA, getModelsForBrand } from "@/lib/car-data";
import AdCard from "./AdCard";
import CarAnimation from "./CarAnimation";
import Link from "next/link";

type Ad = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  pricePerDay: number;
  advertiser: { name: string; companyName: string | null };
  eligibleModels: { brand: string; model: string }[];
};

type Props = {
  ads: Ad[];
  initialBrand: string | null;
  initialModel: string | null;
  isLoggedIn: boolean;
};

export default function HomeClient({ ads, initialBrand, initialModel, isLoggedIn }: Props) {
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand ?? "");
  const [selectedModel, setSelectedModel] = useState<string>(initialModel ?? "");
  const adsRef = useRef<HTMLDivElement>(null);

  const models = selectedBrand ? getModelsForBrand(selectedBrand) : [];

  const filteredAds =
    selectedBrand && selectedModel
      ? ads.filter((ad) =>
          ad.eligibleModels.some(
            (m) =>
              m.brand.toLowerCase() === selectedBrand.toLowerCase() &&
              m.model.toLowerCase() === selectedModel.toLowerCase()
          )
        )
      : ads;

  function handleBrandChange(brand: string) {
    setSelectedBrand(brand);
    setSelectedModel("");
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
          {/* Animated car */}
          <div className="mb-3">
            <CarAnimation />
          </div>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Choisissez une annonce, posez un covering chez un partenaire, et gagnez de l&apos;argent en conduisant normalement.
          </p>

          {/* Car Selector Card — prominent */}
          <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 sm:p-7 shadow-xl shadow-orange-100/60">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Car className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <h2 className="font-bold text-gray-900 text-base leading-tight">Sélectionnez votre véhicule</h2>
                <p className="text-gray-400 text-xs">Pour voir les annonces compatibles</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Marque</label>
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer font-medium"
                  >
                    <option value="">-- Choisir une marque --</option>
                    {CAR_DATA.map((d) => <option key={d.brand} value={d.brand}>{d.brand}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Modèle</label>
                <div className="relative">
                  <select
                    value={selectedModel}
                    onChange={(e) => handleModelChange(e.target.value)}
                    disabled={!selectedBrand}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    <option value="">-- Choisir un modèle --</option>
                    {models.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {selectedBrand && selectedModel ? (
              <div className="mt-4 flex items-center justify-between bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
                <p className="text-gray-600 text-sm">
                  <span className="text-gray-900 font-bold">{filteredAds.length}</span>{" "}
                  annonce{filteredAds.length !== 1 ? "s" : ""} pour{" "}
                  <span className="text-orange-500 font-semibold">{selectedBrand} {selectedModel}</span>
                </p>
                <button
                  onClick={() => adsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-bold transition-colors"
                >
                  Voir <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="mt-4 text-gray-400 text-xs text-center">Sélectionnez votre marque puis votre modèle</p>
            )}
          </div>

          {!isLoggedIn && (
            <p className="mt-4 text-gray-400 text-sm">
              Pas encore inscrit ?{" "}
              <Link href="/auth/register" className="text-orange-500 hover:text-orange-600 font-semibold">
                Créer un compte
              </Link>
            </p>
          )}
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-5 h-5 text-gray-300" />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Comment ça marche ?</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            3 étapes simples pour monétiser votre véhicule.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                step: "01", icon: Car, title: "Choisissez une annonce",
                desc: "Sélectionnez votre véhicule et parcourez les campagnes disponibles. Chaque annonceur définit les modèles éligibles.",
              },
              {
                step: "02", icon: Shield, title: "Posez le covering",
                desc: "Prenez rendez-vous chez l'un de nos partenaires. L'installation du covering est prise en charge par l'annonceur.",
              },
              {
                step: "03", icon: TrendingUp, title: "Touchez vos gains",
                desc: "Conduisez normalement et recevez votre rémunération quotidienne directement sur votre compte.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-black text-gray-100 mb-3 leading-none">{item.step}</div>
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-4 border border-orange-100">
                  <item.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADS SECTION ── */}
      <section ref={adsRef} className="py-20 px-4 bg-white border-t border-gray-100 min-h-screen" id="annonces">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedBrand && selectedModel
                  ? `Annonces pour ${selectedBrand} ${selectedModel}`
                  : "Toutes les annonces"}
              </h2>
              <p className="text-gray-500">
                {selectedBrand && selectedModel
                  ? `${filteredAds.length} campagne${filteredAds.length !== 1 ? "s" : ""} compatible${filteredAds.length !== 1 ? "s" : ""}`
                  : "Sélectionnez votre véhicule ci-dessus pour filtrer"}
              </p>
            </div>
            {(!selectedBrand || !selectedModel) && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-sm text-orange-500 hover:text-orange-600 font-semibold border border-orange-200 hover:border-orange-300 px-4 py-2 rounded-xl transition-all self-start bg-orange-50"
              >
                ↑ Sélectionner mon véhicule
              </button>
            )}
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-20">
              <Car className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Aucune annonce disponible pour le moment</p>
              <p className="text-gray-300 text-sm mt-2">Revenez bientôt, de nouvelles campagnes arrivent régulièrement.</p>
            </div>
          ) : filteredAds.length === 0 && selectedBrand && selectedModel ? (
            <div className="text-center py-20">
              <Car className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                Pas d&apos;annonce compatible avec votre {selectedBrand} {selectedModel}
              </p>
              <p className="text-gray-300 text-sm mt-2">De nouvelles campagnes pour votre modèle arrivent bientôt.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(filteredAds.length > 0 ? filteredAds : ads).map((ad) => (
                <AdCard key={ad.id} ad={ad} userBrand={selectedBrand} userModel={selectedModel} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
