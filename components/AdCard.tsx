import { Euro, Car } from "lucide-react";
import Link from "next/link";

type Ad = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  pricePerDay: number;
  advertiser: { companyName: string | null; name: string };
  eligibleModels: { brand: string; model: string }[];
};

export default function AdCard({ ad, userBrand, userModel }: { ad: Ad; userBrand?: string; userModel?: string }) {
  const isCompatible =
    userBrand && userModel
      ? ad.eligibleModels.some(
          (m) =>
            m.brand.toLowerCase() === userBrand.toLowerCase() &&
            m.model.toLowerCase() === userModel.toLowerCase()
        )
      : true;

  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-orange-300 ${
        isCompatible ? "border-gray-200" : "border-gray-100 opacity-60"
      }`}
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {ad.imageUrl ? (
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Car className="w-10 h-10 text-gray-300 mx-auto mb-1" />
              <p className="text-gray-400 text-xs">Photo à venir</p>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-zinc-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {ad.pricePerDay.toFixed(2)}€/jour
          </span>
        </div>
        {!isCompatible && userBrand && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-gray-500 text-xs font-medium bg-white/90 px-3 py-1 rounded-full border border-gray-200">
              Non compatible
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <span className="text-xs text-zinc-700 font-semibold uppercase tracking-wider">
          {ad.advertiser.companyName ?? ad.advertiser.name}
        </span>
        <h3 className="font-bold text-gray-900 text-base mt-1 mb-2 leading-snug">{ad.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{ad.description}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Euro className="w-3 h-3" />
            ≈ {(ad.pricePerDay * 30).toFixed(0)}€/mois
          </span>
          <span className="flex items-center gap-1">
            <Car className="w-3 h-3" />
            {ad.eligibleModels.length} modèle{ad.eligibleModels.length > 1 ? "s" : ""}
          </span>
        </div>

        <Link
          href={isCompatible ? `/ads/${ad.id}` : "#"}
          className={`w-full block text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            isCompatible
              ? "bg-zinc-700 hover:bg-zinc-800 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
          }`}
        >
          {isCompatible ? "Voir l'annonce" : "Non disponible"}
        </Link>
      </div>
    </div>
  );
}
