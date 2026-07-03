"use client";

import { useActionState } from "react";
import { updateAdvertiserProfile } from "@/app/actions/auth";

export default function ProfileForm({ companyName, siret }: { companyName: string | null; siret: string | null }) {
  const [state, action, pending] = useActionState(updateAdvertiserProfile, undefined);

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">Informations mises à jour.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l&apos;entreprise</label>
          <input
            name="companyName"
            type="text"
            required
            defaultValue={companyName ?? ""}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">SIRET <span className="text-gray-400 font-normal">(optionnel)</span></label>
          <input
            name="siret"
            type="text"
            defaultValue={siret ?? ""}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-zinc-700 hover:bg-zinc-800 disabled:opacity-60 text-zinc-900 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
