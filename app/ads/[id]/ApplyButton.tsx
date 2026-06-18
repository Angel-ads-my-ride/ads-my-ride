"use client";

import { useActionState } from "react";
import { applyToAd } from "@/app/actions/ads";
import { CheckCircle } from "lucide-react";

export default function ApplyButton({ adId }: { adId: string }) {
  const [state, action, pending] = useActionState(applyToAd, undefined);

  if (state?.success) {
    return (
      <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-600 py-3 rounded-xl text-sm font-semibold">
        <CheckCircle className="w-4 h-4" /> Candidature envoyée !
      </div>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="adId" value={adId} />
      {state?.error && <p className="text-red-500 text-xs text-center mb-3">{state.error}</p>}
      <button type="submit" disabled={pending}
        className="w-full bg-zinc-700 hover:bg-zinc-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm">
        {pending ? "Envoi…" : "Candidater à cette annonce"}
      </button>
    </form>
  );
}
