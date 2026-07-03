import Link from "next/link";
import { Car, Megaphone } from "lucide-react";

export default function RegisterChoicePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/Logo.png" alt="Ads My Ride" className="w-10 h-10 object-contain" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">Quel type de compte souhaitez-vous créer ?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href="/auth/register"
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:border-zinc-400 hover:shadow-md transition-all text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <Car className="w-6 h-6 text-zinc-700" />
            </div>
            <h2 className="font-bold text-gray-900 mb-1.5">Je suis conducteur</h2>
            <p className="text-gray-500 text-sm">
              Monétisez votre véhicule en portant les publicités d&apos;annonceurs.
            </p>
          </Link>

          <Link
            href="/advertiser/auth/register"
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:border-zinc-400 hover:shadow-md transition-all text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-6 h-6 text-zinc-700" />
            </div>
            <h2 className="font-bold text-gray-900 mb-1.5">Je suis annonceur</h2>
            <p className="text-gray-500 text-sm">
              Publiez une annonce pour afficher votre marque sur des véhicules du quotidien.
            </p>
          </Link>
        </div>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-zinc-700 hover:text-zinc-800 font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
