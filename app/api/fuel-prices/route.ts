import { NextResponse } from "next/server";
import { getEuropeFuelPrices } from "@/lib/fuel-prices";

export const revalidate = 21600;

export async function GET() {
  const prices = await getEuropeFuelPrices(revalidate);

  return NextResponse.json({
    fuelType: "unleaded",
    countries: prices,
    sourceNotes: [
      "France: moyenne nationale E10/SP95/SP98 via data.economie.gouv.fr.",
      "Autres pays: moyenne des prix essence disponibles via OpenVan.camp.",
    ],
  });
}
