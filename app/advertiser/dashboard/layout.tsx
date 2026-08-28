import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/session";
import { LayoutDashboard, Settings } from "lucide-react";
import DashboardMobileMenu from "@/components/DashboardMobileMenu";
import LogoutSubmitButton from "@/components/LogoutSubmitButton";

const NAV = [
  { href: "/advertiser/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/advertiser/dashboard/settings", label: "Réglages", icon: Settings },
];

export default async function AdvertiserDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ADVERTISER") redirect("/auth/login");

  return (
    <div className="h-dvh overflow-hidden bg-gray-50 flex">
      <DashboardMobileMenu variant="advertiser" />

      {/* Sidebar */}
      <aside className="hidden md:flex w-60 h-dvh flex-shrink-0 bg-white border-r border-gray-200 flex-col">
        <div className="p-5 border-b border-gray-100">
          <Link href="/">
            <Image src="/Logo.png" alt="Ads My Ride" width={40} height={40} className="w-10 h-10 object-contain" />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150 text-sm font-medium cursor-pointer active:scale-[0.98]"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <form action="/api/auth/logout" method="POST">
            <LogoutSubmitButton />
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 h-dvh overflow-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
