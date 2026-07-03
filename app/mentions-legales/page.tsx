import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <img src="/Logo.png" alt="Ads My Ride" className="w-10 h-10 object-contain" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mentions légales</h1>
        <p className="text-gray-500 text-sm">
          Cette page est en cours de rédaction. Revenez bientôt.
        </p>
        <Link href="/" className="inline-block mt-6 text-zinc-700 hover:text-zinc-800 text-sm font-semibold">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
