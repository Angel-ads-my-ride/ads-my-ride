import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { deleteOwnAccount } from "@/app/actions/auth";
import ProfileForm from "./ProfileForm";
import DangerZone from "@/components/DangerZone";

export default async function DashboardSettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "CUSTOMER") redirect("/auth/login");

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/auth/login");

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Réglages</h1>
        <p className="text-gray-500 mt-1">Gérez vos informations et votre compte.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Informations du compte</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Nom</p>
            <p className="text-gray-900 font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Email</p>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Profil &amp; véhicule</h2>
        <ProfileForm
          initialBrand={user.carBrand}
          initialModel={user.carModel}
          name={user.name}
          avatarUrl={user.avatarUrl}
        />
      </div>

      <DangerZone deleteAction={deleteOwnAccount} />
    </main>
  );
}
