"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar({ role }: { role?: string | null }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/Logo.png" alt="Ads My Ride" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-tight text-gray-900">
            Ads <span className="text-zinc-700">My Ride</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {role === "CUSTOMER" && (
            <>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Mon dashboard
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                  Déconnexion
                </button>
              </form>
            </>
          )}
          {role === "ADVERTISER" && (
            <>
              <Link href="/advertiser/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard annonceur
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                  Déconnexion
                </button>
              </form>
            </>
          )}
          {!role && (
            <>
              <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="text-sm bg-zinc-700 hover:bg-zinc-800 text-zinc-900 px-4 py-2 rounded-lg transition-colors font-semibold shadow-sm"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
