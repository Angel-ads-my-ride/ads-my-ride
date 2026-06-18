"use client";

import { useState, useTransition } from "react";
import { adminDeleteUser, adminToggleUserRole } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

const ROLES = ["CUSTOMER", "ADVERTISER", "SUPER_ADMIN"];

export default function UserActions({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [role, setRole] = useState(currentRole);
  const [rolePending, startRoleTransition] = useTransition();
  const [delPending, startDelTransition] = useTransition();
  const router = useRouter();

  function changeRole(newRole: string) {
    setRole(newRole);
    startRoleTransition(async () => {
      await adminToggleUserRole(userId, newRole);
      router.refresh();
    });
  }

  function del() {
    if (!confirm("Supprimer cet utilisateur définitivement ?")) return;
    startDelTransition(async () => {
      await adminDeleteUser(userId);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <select
        value={role}
        onChange={(e) => changeRole(e.target.value)}
        disabled={rolePending}
        className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-zinc-500 disabled:opacity-50 cursor-pointer"
      >
        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <button
        onClick={del}
        disabled={delPending}
        className="text-xs text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {delPending ? "…" : "Supprimer"}
      </button>
    </div>
  );
}
