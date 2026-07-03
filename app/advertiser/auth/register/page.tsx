import Link from "next/link";
import AdvertiserRegisterForm from "@/components/AdvertiserRegisterForm";

export default function AdvertiserRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/Logo.png" alt="Ads My Ride" className="w-10 h-10 object-contain" />
          </Link>
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-3 font-medium">
            Espace Annonceur
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Devenir annonceur</h1>
          <p className="text-gray-500 text-sm mt-1">Lancez votre première campagne sur des véhicules du quotidien</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <AdvertiserRegisterForm />

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Déjà un compte ?{" "}
              <Link href="/auth/login" className="text-zinc-700 hover:text-zinc-800 font-semibold">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
