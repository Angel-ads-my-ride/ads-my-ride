"use client";

import { useState, useTransition } from "react";
import { reviewAd, adminDeleteAd } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export default function ReviewForm({ adId, currentStatus }: { adId: string; currentStatus: string }) {
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | "PENDING_MODIFICATION">("APPROVED");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [delPending, startDelTransition] = useTransition();
  const router = useRouter();

  function submit() {
    startTransition(async () => {
      await reviewAd(adId, decision, message || undefined);
      router.push("/admin/ads");
    });
  }

  function del() {
    if (!confirm("Supprimer définitivement cette annonce ?")) return;
    startDelTransition(async () => {
      await adminDeleteAd(adId);
      router.push("/admin/ads");
    });
  }

  const DECISIONS = [
    { value: "APPROVED" as const,             label: "Approuver",               cls: "border-green-500/50 bg-green-500/10 text-green-400 data-[selected=true]:bg-green-500/20 data-[selected=true]:border-green-500" },
    { value: "REJECTED" as const,             label: "Refuser",                 cls: "border-red-500/50 bg-red-500/10 text-red-400 data-[selected=true]:bg-red-500/20 data-[selected=true]:border-red-500" },
    { value: "PENDING_MODIFICATION" as const, label: "Demander une modification",cls: "border-orange-500/50 bg-orange-500/10 text-orange-400 data-[selected=true]:bg-orange-500/20 data-[selected=true]:border-orange-500" },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
      <h2 className="font-semibold text-white">Décision</h2>

      <div className="flex flex-col gap-2">
        {DECISIONS.map((d) => (
          <button
            key={d.value}
            type="button"
            data-selected={decision === d.value}
            onClick={() => setDecision(d.value)}
            className={`text-left px-4 py-3 rounded-xl border transition-colors text-sm font-medium ${d.cls}`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {(decision === "REJECTED" || decision === "PENDING_MODIFICATION") && (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Message à l&apos;annonceur {decision === "REJECTED" ? "" : "*"}
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Expliquez la raison ou les modifications attendues…"
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/15 placeholder:text-zinc-600 resize-none"
          />
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={isPending || (decision !== "APPROVED" && !message.trim())}
        className="w-full bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-semibold py-3 rounded-xl transition-colors"
      >
        {isPending ? "Envoi…" : "Confirmer la décision"}
      </button>

      <div className="border-t border-zinc-800 pt-4">
        <button
          type="button"
          onClick={del}
          disabled={delPending}
          className="w-full text-sm text-red-400 hover:text-red-300 py-2 transition-colors disabled:opacity-50"
        >
          {delPending ? "Suppression…" : "Supprimer définitivement l'annonce"}
        </button>
      </div>
    </div>
  );
}
