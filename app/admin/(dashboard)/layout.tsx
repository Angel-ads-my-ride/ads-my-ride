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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <Link href="/">
            <img src="/Logo.png" alt="Ads My Ride" className="w-10 h-10 object-contain" />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors text-sm">
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
