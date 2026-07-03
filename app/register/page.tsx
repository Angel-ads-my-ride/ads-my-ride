"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Megaphone } from "lucide-react";
import CustomerRegisterForm from "@/components/CustomerRegisterForm";
import AdvertiserRegisterForm from "@/components/AdvertiserRegisterForm";

type Tab = "customer" | "advertiser";

export default function RegisterChoicePage() {
  const [tab, setTab] = useState<Tab>("customer");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/Logo.png" alt="Ads My Ride" className="w-10 h-10 object-contain" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">
            {tab === "customer"
              ? "Rejoignez les conducteurs qui monétisent leur véhicule"
              : "Lancez votre première campagne sur des véhicules du quotidien"}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 p-1.5 gap-1.5 bg-gray-50 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setTab("customer")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
                tab === "customer"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Car className="w-4 h-4" /> Conducteur
            </button>
            <button
              type="button"
              onClick={() => setTab("advertiser")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
                tab === "advertiser"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Megaphone className="w-4 h-4" /> Annonceur
            </button>
          </div>

          <div className="p-8">
            {tab === "customer" ? <CustomerRegisterForm /> : <AdvertiserRegisterForm />}
          </div>
        </div>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Déjà un compte ?{" "}
          <Link
            href={tab === "customer" ? "/auth/login" : "/advertiser/auth/login"}
            className="text-zinc-700 hover:text-zinc-800 font-semibold"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
