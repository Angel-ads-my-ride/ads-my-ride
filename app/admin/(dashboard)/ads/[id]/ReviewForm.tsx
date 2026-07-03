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
    { value: "APPROVED" as const,             label: "Approuver",               cls: "border-green-200 bg-green-50 text-green-700 data-[selected=true]:bg-green-100 data-[selected=true]:border-green-400" },
    { value: "REJECTED" as const,             label: "Refuser",                 cls: "border-red-200 bg-red-50 text-red-700 data-[selected=true]:bg-red-100 data-[selected=true]:border-red-400" },
    { value: "PENDING_MODIFICATION" as const, label: "Demander une modification",cls: "border-orange-200 bg-orange-50 text-orange-700 data-[selected=true]:bg-orange-100 data-[selected=true]:border-orange-400" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
      <h2 className="font-semibold text-gray-900">Décision</h2>

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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Message à l&apos;annonceur {decision === "REJECTED" ? "" : "*"}
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Expliquez la raison ou les modifications attendues…"
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 placeholder:text-gray-400 resize-none"
          />
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={isPending || (decision !== "APPROVED" && !message.trim())}
        className="w-full bg-zinc-700 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-semibold py-3 rounded-xl transition-colors"
      >
        {isPending ? "Envoi…" : "Confirmer la décision"}
      </button>

      <div className="border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={del}
          disabled={delPending}
          className="w-full text-sm text-red-600 hover:text-red-700 py-2 transition-colors disabled:opacity-50"
        >
          {delPending ? "Suppression…" : "Supprimer définitivement l'annonce"}
        </button>
      </div>
    </div>
  );
}
