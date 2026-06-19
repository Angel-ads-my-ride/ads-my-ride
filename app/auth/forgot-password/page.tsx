"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { requestPasswordReset } from "@/app/actions/reset-password";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/Logo.png" alt="Ads My Ride" className="w-10 h-10 object-contain" />
            <span className="font-bold text-lg text-gray-900">
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
          <p className="text-gray-500 text-sm mt-1">On t&apos;envoie un lien pour réinitialiser ton mot de passe</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {state?.success ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-50 border-2 border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-green-500" />
              </div>
              <h2 className="font-bold text-gray-900 text-lg mb-2">Email envoyé !</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Si un compte existe avec cette adresse, tu recevras un lien de réinitialisation valable <strong>1 heure</strong>.
              </p>
              <Link href="/auth/login"
                className="inline-block mt-6 text-zinc-700 hover:text-zinc-800 font-semibold text-sm">
                ← Retour à la connexion
              </Link>
            </div>
          ) : (
            <form action={action} className="space-y-5">
              {state?.error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {state.error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="vous@exemple.com"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/15 transition-all placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full bg-zinc-700 hover:bg-zinc-800 disabled:opacity-60 text-zinc-900 font-semibold py-3 rounded-xl transition-colors shadow-sm"
              >
                {pending ? "Envoi en cours…" : "Envoyer le lien"}
              </button>

              <div className="text-center">
                <Link href="/auth/login" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
