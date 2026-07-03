import { db } from "@/lib/db";

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "text-amber-600 bg-amber-50",
  CONFIRMED: "text-green-600 bg-green-50",
  COMPLETED: "text-blue-600 bg-blue-50",
  CANCELLED: "text-red-600 bg-red-50",
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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Candidatures ({bookings.length})</h1>
      <div className="flex gap-4 mb-6">
        {Object.entries(counts).map(([status, count]) => (
          <span key={status} className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[status] ?? "text-gray-500 bg-gray-100"}`}>
            {STATUS_LABELS[status] ?? status} ({count})
          </span>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {bookings.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">Aucune candidature</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium text-sm">
                    {b.user.name}
                    <span className="text-gray-400 font-normal"> → </span>
                    {b.ad.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {b.user.email} · {b.user.carBrand} {b.user.carModel}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Annonceur : {b.ad.advertiser.companyName ?? b.ad.advertiser.name} · {new Date(b.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[b.status] ?? "text-gray-500 bg-gray-100"}`}>
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
