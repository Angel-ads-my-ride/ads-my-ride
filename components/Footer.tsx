import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/Logo.png" alt="Ads My Ride" className="w-8 h-8 object-contain" />
        </Link>
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} Ads My Ride. Tous droits réservés.
        </p>
        <Link href="/mentions-legales" className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
          Mentions légales
        </Link>
      </div>
    </footer>
  );
}
