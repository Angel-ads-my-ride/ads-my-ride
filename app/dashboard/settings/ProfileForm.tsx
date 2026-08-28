"use client";

import { useActionState, useState } from "react";
import { ChevronDown } from "lucide-react";
import { updateCustomerProfile } from "@/app/actions/auth";
import { CAR_DATA, getModelsForBrand } from "@/lib/car-data";
import AvatarUpload from "@/components/AvatarUpload";

export default function ProfileForm({
  initialBrand,
  initialModel,
  name,
  avatarUrl,
}: {
  initialBrand: string | null;
  initialModel: string | null;
  name: string;
  avatarUrl: string | null;
}) {
  const [state, action, pending] = useActionState(updateCustomerProfile, undefined);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand ?? "");
  const models = selectedBrand ? getModelsForBrand(selectedBrand) : [];

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">Véhicule mis à jour.</div>
      )}

      <AvatarUpload currentUrl={avatarUrl} name={name} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Marque</label>
          <div className="relative group">
            <select
              name="carBrand"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 transition-all cursor-pointer font-medium shadow-sm hover:border-gray-300"
            >
              <option value="">Choisir une marque</option>
              {CAR_DATA.map((d) => <option key={d.brand} value={d.brand}>{d.brand}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-6 h-6 bg-gray-100 rounded-lg">
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Modèle</label>
          <div className="relative group">
            <select
              name="carModel"
              defaultValue={initialModel ?? ""}
              disabled={!selectedBrand}
              className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 transition-all cursor-pointer font-medium shadow-sm hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <option value="">{selectedBrand ? "Choisir un modèle" : "Marque d'abord…"}</option>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-6 h-6 bg-gray-100 rounded-lg">
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto bg-zinc-700 hover:bg-zinc-800 disabled:opacity-60 text-zinc-900 font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 text-sm shadow-sm cursor-pointer active:scale-[0.98] disabled:cursor-wait"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
