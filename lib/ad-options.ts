export const COUNTRIES = [
  "France",
  "Belgique",
  "Suisse",
  "Luxembourg",
  "Monaco",
  "Canada",
] as const;

export const VEHICLE_CONDITIONS = [
  { value: "NEUF", label: "Neuf" },
  { value: "TRES_BON", label: "Très bon état" },
  { value: "BON", label: "Bon état" },
] as const;

// Average price (€/L) of unleaded 95 fuel per country. These are static reference
// estimates (updated manually) used only to suggest a fair km/day range in the
// advertiser's budget estimator — not a live/real-time price feed.
export const FUEL_PRICE_PER_LITER: Record<(typeof COUNTRIES)[number], number> = {
  France: 1.85,
  Belgique: 1.75,
  Suisse: 1.90,
  Luxembourg: 1.60,
  Monaco: 1.85,
  Canada: 1.10,
};

// Average fuel consumption used for the km/day suggestion, in L/100km.
export const AVERAGE_CONSUMPTION_L_PER_100KM = 6.5;

// Reference driver cost used only for the budget estimator's suggestions.
export const ESTIMATOR_DAILY_RATE_PER_DRIVER = 7.8; // €/day
export const ESTIMATOR_FLAT_COST_PER_DRIVER = 200; // € one-time, per driver
