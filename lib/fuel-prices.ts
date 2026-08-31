import { COUNTRIES, FUEL_PRICE_PER_LITER } from "@/lib/ad-options";

export type FuelCountry = (typeof COUNTRIES)[number];

export type FuelPriceItem = {
  country: FuelCountry;
  code: string;
  averagePrice: number;
  roundedAveragePrice: number;
  currency: string;
  unit: "liter";
  source: string;
  updatedAt: string | null;
  components: Record<string, number> | null;
  fallback: boolean;
};

const FRANCE_DATASET_API_URL =
  "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records";

const OPENVAN_FUEL_URL = "https://openvan.camp/api/fuel/prices?source=adsmyride.com";
const GASOLINE_KEYS = ["gasoline_regular", "gasoline", "gasoline_premium", "gasoline_super", "premium"] as const;

const EUROPE_FUEL_COUNTRIES: Array<{ country: FuelCountry; code: string }> = [
  { country: "France", code: "FR" },
  { country: "Belgique", code: "BE" },
  { country: "Suisse", code: "CH" },
  { country: "Luxembourg", code: "LU" },
  { country: "Monaco", code: "MC" },
  { country: "Allemagne", code: "DE" },
  { country: "Espagne", code: "ES" },
  { country: "Italie", code: "IT" },
  { country: "Portugal", code: "PT" },
  { country: "Pays-Bas", code: "NL" },
];

type FranceFuelAverageResponse = {
  results?: Array<{
    e10?: number | null;
    sp95?: number | null;
    sp98?: number | null;
    e10_count?: number | null;
    sp95_count?: number | null;
    sp98_count?: number | null;
  }>;
};

type OpenVanCountry = {
  currency?: string | null;
  unit?: string | null;
  prices?: Record<string, number | null>;
  fetched_at?: string | null;
  sources?: string[];
};

type OpenVanResponse = {
  success?: boolean;
  data?: Record<string, OpenVanCountry>;
  meta?: { updated_at?: string | null };
};

function roundPrice(price: number) {
  return Math.round(price * 100) / 100;
}

function fallbackFuelPrice(country: FuelCountry, code: string): FuelPriceItem {
  const price = FUEL_PRICE_PER_LITER[country] ?? FUEL_PRICE_PER_LITER.France;

  return {
    country,
    code,
    averagePrice: price,
    roundedAveragePrice: price,
    currency: country === "Suisse" ? "CHF" : "EUR",
    unit: "liter",
    source: "fallback",
    updatedAt: null,
    components: null,
    fallback: true,
  };
}

export async function getFranceFuelPrice(revalidate = 900): Promise<FuelPriceItem> {
  const params = new URLSearchParams({
    select: [
      "avg(e10_prix) as e10",
      "avg(sp95_prix) as sp95",
      "avg(sp98_prix) as sp98",
      "count(e10_prix) as e10_count",
      "count(sp95_prix) as sp95_count",
      "count(sp98_prix) as sp98_count",
    ].join(", "),
    limit: "1",
  });

  try {
    const response = await fetch(`${FRANCE_DATASET_API_URL}?${params}`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`Fuel API responded ${response.status}`);

    const data = (await response.json()) as FranceFuelAverageResponse;
    const result = data.results?.[0];
    const components = {
      e10: result?.e10 ?? null,
      sp95: result?.sp95 ?? null,
      sp98: result?.sp98 ?? null,
    };
    const prices = Object.values(components).filter(
      (price): price is number => typeof price === "number" && Number.isFinite(price)
    );

    if (prices.length === 0) throw new Error("Fuel API returned no usable prices");

    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    return {
      country: "France",
      code: "FR",
      averagePrice,
      roundedAveragePrice: roundPrice(averagePrice),
      currency: "EUR",
      unit: "liter",
      source: "data.economie.gouv.fr",
      updatedAt: null,
      components: Object.fromEntries(
        Object.entries(components).filter(([, value]) => typeof value === "number")
      ) as Record<string, number>,
      fallback: false,
    };
  } catch {
    return fallbackFuelPrice("France", "FR");
  }
}

function averageOpenVanGasoline(country: OpenVanCountry) {
  const components: Record<string, number> = {};

  for (const key of GASOLINE_KEYS) {
    const price = country.prices?.[key];
    if (typeof price === "number" && Number.isFinite(price)) {
      components[key] = price;
    }
  }

  const prices = [...new Set(Object.values(components))];

  if (prices.length === 0) return null;

  return {
    averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    components,
  };
}

export async function getEuropeFuelPrices(revalidate = 21600): Promise<FuelPriceItem[]> {
  const francePrice = await getFranceFuelPrice(revalidate);
  let openVanData: OpenVanResponse | null = null;

  try {
    const response = await fetch(OPENVAN_FUEL_URL, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`OpenVan API responded ${response.status}`);
    openVanData = (await response.json()) as OpenVanResponse;
  } catch {
    openVanData = null;
  }

  return EUROPE_FUEL_COUNTRIES.map(({ country, code }) => {
    if (country === "France") return francePrice;

    const openVanCountry = openVanData?.data?.[code];
    const gasolineAverage = openVanCountry ? averageOpenVanGasoline(openVanCountry) : null;

    if (!openVanCountry || !gasolineAverage) return fallbackFuelPrice(country, code);

    return {
      country,
      code,
      averagePrice: gasolineAverage.averagePrice,
      roundedAveragePrice: roundPrice(gasolineAverage.averagePrice),
      currency: openVanCountry.currency ?? (country === "Suisse" ? "CHF" : "EUR"),
      unit: "liter",
      source: openVanCountry.sources?.[0] ?? "OpenVan.camp",
      updatedAt: openVanCountry.fetched_at ?? openVanData?.meta?.updated_at ?? null,
      components: gasolineAverage.components,
      fallback: false,
    };
  });
}
