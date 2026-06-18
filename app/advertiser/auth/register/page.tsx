"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAdvertiser } from "@/app/actions/auth";

export default function AdvertiserRegisterPage() {
  const [state, action, pending] = useActionState(registerAdvertiser, undefined);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900">
              Ads <span className="text-zinc-700">My Ride</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-3 font-medium">
            Espace Annonceur
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Devenir annonceur</h1>
          <p className="text-gray-500 text-sm mt-1">Lancez votre première campagne sur des véhicules du quotidien</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du contact</label>
                <input name="name" type="text" required placeholder="Marie Martin"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l&apos;entreprise</label>
                <input name="companyName" type="text" required placeholder="Ma Marque SAS"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email professionnel</label>
                <input name="email" type="email" required placeholder="contact@mamarque.fr"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SIRET <span className="text-gray-400 font-normal">(optionnel)</span></label>
                <input name="siret" type="text" placeholder="123 456 789 00012"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input name="password" type="password" required minLength={8} placeholder="Minimum 8 caractères"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400" />
            </div>

            <button type="submit" disabled={pending}
              className="w-full bg-zinc-700 hover:bg-zinc-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm">
              {pending ? "Création…" : "Créer mon compte annonceur"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Déjà un compte ?{" "}
              <Link href="/advertiser/auth/login" className="text-zinc-700 hover:text-zinc-800 font-semibold">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
