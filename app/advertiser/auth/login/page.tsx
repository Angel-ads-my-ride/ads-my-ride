"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAdvertiser } from "@/app/actions/auth";

export default function AdvertiserLoginPage() {
  const [state, action, pending] = useActionState(loginAdvertiser, undefined);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900">
              Ads <span className="text-orange-500">My Ride</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-3 font-medium">
            Espace Annonceur
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Connexion annonceur</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez vos campagnes publicitaires</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form action={action} className="space-y-5">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email professionnel</label>
              <input name="email" type="email" required placeholder="contact@votre-marque.fr"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input name="password" type="password" required placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400" />
            </div>

            <button type="submit" disabled={pending}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm">
              {pending ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Pas encore partenaire ?{" "}
              <Link href="/advertiser/auth/register" className="text-orange-500 hover:text-orange-600 font-semibold">
                Créer un compte annonceur
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Vous êtes conducteur ?{" "}
          <Link href="/auth/login" className="text-gray-500 hover:text-gray-700">Connexion conducteur</Link>
        </p>
      </div>
    </div>
  );
}
