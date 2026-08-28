"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Menu, Settings, X } from "lucide-react";
import LogoutSubmitButton from "@/components/LogoutSubmitButton";

type DashboardMobileMenuProps = {
  variant: "customer" | "advertiser";
};

export default function DashboardMobileMenu({ variant }: DashboardMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const nav =
    variant === "advertiser"
      ? [
          { href: "/advertiser/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/advertiser/dashboard/settings", label: "R\u00e9glages", icon: Settings },
        ]
      : [
          { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/dashboard/settings", label: "R\u00e9glages", icon: Settings },
        ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <header className="md:hidden fixed inset-x-0 top-0 z-40 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="h-full px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            className="-ml-2 p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150 cursor-pointer active:scale-[0.96]"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image src="/Logo.png" alt="Ads My Ride" width={40} height={40} className="w-10 h-10 object-contain" />
          </Link>

          <div className="w-10" />
        </div>
      </header>

      <button
        type="button"
        aria-label="Fermer le menu"
        tabIndex={open ? 0 : -1}
        className={`md:hidden fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-dvh w-72 max-w-[84vw] bg-white shadow-xl flex flex-col p-5 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image src="/Logo.png" alt="Ads My Ride" width={36} height={36} className="w-9 h-9 object-contain" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150 cursor-pointer active:scale-[0.96]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98] ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-3 border-t border-gray-100">
          <form action="/api/auth/logout" method="POST">
            <LogoutSubmitButton />
          </form>
        </div>
      </aside>
    </>
  );
}
