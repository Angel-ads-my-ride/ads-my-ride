"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions/admin";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAdmin, undefined);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="Ads My Ride" className="w-32 h-32 object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Ads My Ride — Super Admin</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form action={action} className="space-y-4">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@adsmyride.com"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-zinc-700 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-semibold py-3 rounded-xl transition-colors"
            >
              {pending ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
