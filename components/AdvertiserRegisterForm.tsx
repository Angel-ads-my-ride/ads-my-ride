"use client";

import { useActionState } from "react";
import { registerAdvertiser } from "@/app/actions/auth";

export default function AdvertiserRegisterForm() {
  const [state, action, pending] = useActionState(registerAdvertiser, undefined);

  return (
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
            autoComplete="email"
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
          autoComplete="new-password"
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400" />
      </div>

      <button type="submit" disabled={pending} aria-busy={pending}
        className="w-full bg-zinc-700 hover:bg-zinc-800 disabled:opacity-60 text-zinc-900 font-semibold py-3 rounded-xl transition-all duration-150 shadow-sm cursor-pointer active:scale-[0.99] disabled:cursor-wait">
        {pending ? "Création…" : "Créer mon compte annonceur"}
      </button>
    </form>
  );
}
