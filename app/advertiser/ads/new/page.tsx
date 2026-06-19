import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import NewAdForm from "./NewAdForm";

export default async function NewAdPage() {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") redirect("/advertiser/auth/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/advertiser/dashboard" className="text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
            ← Retour au dashboard
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/" className="flex items-center gap-2">
            <img src="/Logo.png" alt="Ads My Ride" className="w-6 h-6 object-contain" />
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Créer une annonce</h1>
          <p className="text-gray-500 text-sm mt-1">Renseignez les détails de votre campagne publicitaire</p>
        </div>
        <NewAdForm />
      </main>
    </div>
  );
}
