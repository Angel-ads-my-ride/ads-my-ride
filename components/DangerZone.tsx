"use client";

import { useTransition } from "react";
import { AlertTriangle } from "lucide-react";

export default function DangerZone({ deleteAction }: { deleteAction: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Cette action est définitive. Supprimer votre compte et toutes vos données associées ?")) return;
    startTransition(() => {
      deleteAction();
    });
  }

  return (
    <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <h2 className="font-semibold text-red-600">Zone de danger</h2>
      </div>
      <p className="text-gray-500 text-sm mb-4">
        La suppression de votre compte est définitive et irréversible. Toutes vos données seront supprimées.
      </p>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
      >
        {pending ? "Suppression…" : "Supprimer mon compte"}
      </button>
    </div>
  );
}
