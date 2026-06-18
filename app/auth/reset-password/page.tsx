"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { resetPassword } from "@/app/actions/reset-password";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, action, pending] = useActionState(resetPassword, undefined);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Lien invalide ou expiré.</p>
          <Link href="/auth/forgot-password" className="text-orange-500 font-semibold hover:text-orange-600">
            Faire une nouvelle demande
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900">
              Ads <span className="text-orange-500">My Ride</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
          <p className="text-gray-500 text-sm mt-1">Choisis un nouveau mot de passe pour ton compte</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {state?.success ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-50 border-2 border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <h2 className="font-bold text-gray-900 text-lg mb-2">Mot de passe mis à jour !</h2>
              <p className="text-gray-500 text-sm">Tu peux maintenant te connecter avec ton nouveau mot de passe.</p>
              <Link href="/auth/login"
                className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Se connecter
              </Link>
            </div>
          ) : (
            <form action={action} className="space-y-5">
              <input type="hidden" name="token" value={token} />

              {state?.error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {state.error}
                  {state.error.includes("expiré") && (
                    <div className="mt-2">
                      <Link href="/auth/forgot-password" className="text-red-600 underline font-semibold">
                        Faire une nouvelle demande
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 caractères"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
                <input
                  name="confirm"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Répète ton mot de passe"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
              >
                {pending ? "Mise à jour…" : "Mettre à jour le mot de passe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
