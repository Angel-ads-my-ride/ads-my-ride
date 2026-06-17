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
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900">
              Ads <span className="text-orange-500">My Ride</span>
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
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input name="email" type="email" required placeholder="vous@exemple.com"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input name="password" type="password" required minLength={8} placeholder="Minimum 8 caractères"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400" />
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-sm font-medium text-gray-700 mb-4">
                Votre véhicule <span className="text-gray-400 font-normal">(optionnel)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <select name="carBrand" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer">
                    <option value="">-- Marque --</option>
                    {CAR_DATA.map((d) => <option key={d.brand} value={d.brand}>{d.brand}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select name="carModel" disabled={!selectedBrand}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    <option value="">-- Modèle --</option>
                    {models.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={pending}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm">
              {pending ? "Création…" : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Déjà un compte ?{" "}
              <Link href="/auth/login" className="text-orange-500 hover:text-orange-600 font-semibold">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
