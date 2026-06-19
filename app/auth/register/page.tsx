"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { registerCustomer } from "@/app/actions/auth";
import { CAR_DATA, getModelsForBrand } from "@/lib/car-data";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerCustomer, undefined);
  const [selectedBrand, setSelectedBrand] = useState("");
  const models = selectedBrand ? getModelsForBrand(selectedBrand) : [];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/Logo.png" alt="Ads My Ride" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg text-gray-900">
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">Rejoignez les conducteurs qui monétisent leur véhicule</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form action={action} className="space-y-5">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {state.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
                <input name="name" type="text" required placeholder="Jean Dupont"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input name="email" type="email" required placeholder="vous@exemple.com"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input name="password" type="password" required minLength={8} placeholder="Minimum 8 caractères"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400" />
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-sm font-medium text-gray-700 mb-4">
                Votre véhicule <span className="text-gray-400 font-normal">(optionnel)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Marque</label>
                  <div className="relative group">
                    <select name="carBrand" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 transition-all cursor-pointer font-medium shadow-sm hover:border-gray-300">
                      <option value="">Choisir une marque</option>
                      {CAR_DATA.map((d) => <option key={d.brand} value={d.brand}>{d.brand}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-6 h-6 bg-gray-100 rounded-lg group-focus-within:bg-zinc-100 transition-colors">
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-focus-within:text-zinc-700 transition-colors" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Modèle</label>
                  <div className="relative group">
                    <select name="carModel" disabled={!selectedBrand}
                      className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 transition-all cursor-pointer font-medium shadow-sm hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:border-gray-200">
                      <option value="">{selectedBrand ? "Choisir un modèle" : "Marque d'abord…"}</option>
                      {models.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-6 h-6 rounded-lg transition-colors ${selectedBrand ? "bg-gray-100 group-focus-within:bg-zinc-100" : "bg-gray-50"}`}>
                      <ChevronDown className={`w-3.5 h-3.5 transition-colors ${selectedBrand ? "text-gray-500 group-focus-within:text-zinc-700" : "text-gray-300"}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={pending}
              className="w-full bg-zinc-700 hover:bg-zinc-800 disabled:opacity-60 text-zinc-900 font-semibold py-3 rounded-xl transition-colors shadow-sm">
              {pending ? "Création…" : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Déjà un compte ?{" "}
              <Link href="/auth/login" className="text-zinc-700 hover:text-zinc-800 font-semibold">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
