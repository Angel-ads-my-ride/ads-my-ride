import { db } from "@/lib/db";

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-green-400 bg-green-400/10",
  COMPLETED: "text-blue-400 bg-blue-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING:   "En attente",
  CONFIRMED: "Confirmé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    include: {
      user:  { select: { name: true, email: true, carBrand: true, carModel: true } },
      ad:    { select: { title: true, advertiser: { select: { name: true, companyName: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const counts: Record<string, number> = {};
  for (const b of bookings) counts[b.status] = (counts[b.status] ?? 0) + 1;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Candidatures ({bookings.length})</h1>
      <div className="flex gap-4 mb-6">
        {Object.entries(counts).map(([status, count]) => (
          <span key={status} className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[status] ?? "text-zinc-400 bg-zinc-700"}`}>
            {STATUS_LABELS[status] ?? status} ({count})
          </span>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {bookings.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-12">Aucune candidature</p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">
                    {b.user.name}
                    <span className="text-zinc-500 font-normal"> → </span>
                    {b.ad.title}
                  </p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {b.user.email} · {b.user.carBrand} {b.user.carModel}
                  </p>
                  <p className="text-zinc-600 text-xs mt-0.5">
                    Annonceur : {b.ad.advertiser.companyName ?? b.ad.advertiser.name} · {new Date(b.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[b.status] ?? "text-zinc-400 bg-zinc-700"}`}>
                  {STATUS_LABELS[b.status] ?? b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
