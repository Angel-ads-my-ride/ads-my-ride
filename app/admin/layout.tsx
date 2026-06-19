import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { LayoutDashboard, FileText, Users, ClipboardList, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin",          label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/ads",      label: "Annonces",     icon: FileText },
  { href: "/admin/users",    label: "Utilisateurs", icon: Users },
  { href: "/admin/bookings", label: "Candidatures", icon: ClipboardList },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") redirect("/admin/login");

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-5 border-b border-zinc-800">
          <Link href="/">
            <img src="/Logo.png" alt="Ads My Ride" className="w-10 h-10 object-contain" />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-800">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
