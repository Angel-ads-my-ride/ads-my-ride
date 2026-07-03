"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ role }: { role?: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const navLinks = (
    <>
      <Link href="/" onClick={() => setDrawerOpen(false)} className="hover:text-gray-900 transition-colors">
        {t.nav.accueil}
      </Link>
      <Link href="/#comment-ca-marche" onClick={() => setDrawerOpen(false)} className="hover:text-gray-900 transition-colors">
        {t.nav.decouvrir}
      </Link>
      <Link href="/#annonces" onClick={() => setDrawerOpen(false)} className="hover:text-gray-900 transition-colors">
        {t.nav.annonces}
      </Link>
    </>
  );

  const authLinks = (
    <>
      {role === "CUSTOMER" && (
        <>
          <Link href="/dashboard" className="text-sm text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors font-medium">
            {t.nav.monDashboard}
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="text-sm text-gray-500 hover:text-red-600 border border-gray-300 hover:border-red-300 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">
              {t.nav.deconnexion}
            </button>
          </form>
        </>
      )}
      {role === "ADVERTISER" && (
        <>
          <Link href="/advertiser/dashboard" className="text-sm text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors font-medium">
            {t.nav.dashboardAnnonceur}
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="text-sm text-gray-500 hover:text-red-600 border border-gray-300 hover:border-red-300 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">
              {t.nav.deconnexion}
            </button>
          </form>
        </>
      )}
      {!role && (
        <>
          <Link href="/auth/login" className="text-sm text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors font-medium">
            {t.nav.connexion}
          </Link>
          <Link
            href="/register"
            className="text-sm bg-zinc-700 hover:bg-zinc-800 text-zinc-900 px-4 py-2 rounded-lg transition-colors font-semibold shadow-sm"
          >
            {t.nav.sinscrire}
          </Link>
        </>
      )}
    </>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Mobile: hamburger on the left */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="sm:hidden -ml-2 p-2 text-gray-600 hover:text-gray-900"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo: left on desktop, absolutely centered on mobile */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 absolute left-1/2 -translate-x-1/2 sm:static sm:left-auto sm:translate-x-0"
        >
          <img src="/Logo.png" alt="Ads My Ride" className="w-10 h-10 object-contain" />
        </Link>

        {/* Center nav: true center regardless of side content, desktop only */}
        <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-gray-600 absolute left-1/2 -translate-x-1/2">
          {navLinks}
        </div>

        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          {authLinks}
          <LanguageSwitcher />
        </div>

        {/* Mobile: language switcher on the right */}
        <div className="sm:hidden flex-shrink-0">
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-72 max-w-[80vw] bg-white shadow-xl flex flex-col p-5">
            <div className="flex items-center justify-between mb-8">
              <img src="/Logo.png" alt="Ads My Ride" className="w-9 h-9 object-contain" />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-5 text-base font-medium text-gray-700 mb-8">
              {navLinks}
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              {authLinks}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
