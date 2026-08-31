export const COUNTRIES = [
  "France",
  "Belgique",
  "Suisse",
  "Luxembourg",
  "Monaco",
  "Allemagne",
  "Espagne",
  "Italie",
  "Portugal",
  "Pays-Bas",
  "Canada",
] as const;

export const VEHICLE_CONDITIONS = [
  { value: "NEUF", label: "Neuf" },
  { value: "TRES_BON", label: "Très bon état" },
  { value: "BON", label: "Bon état" },
] as const;

// Average price (€/L) per country. France is a fallback for the live national
// unleaded average used by the advertiser's budget estimator.
export const FUEL_PRICE_PER_LITER: Record<(typeof COUNTRIES)[number], number> = {
  France: 2.09,
  Belgique: 2.03,
  Suisse: 1.97,
  Luxembourg: 1.74,
  Monaco: 2.18,
  Allemagne: 2.27,
  Espagne: 1.85,
  Italie: 2.18,
  Portugal: 2.08,
  "Pays-Bas": 2.62,
  Canada: 1.10,
};

// Average fuel consumption used for the km/day suggestion, in L/100km.
export const AVERAGE_CONSUMPTION_L_PER_100KM = 6.5;

// Reference driver cost used only for the budget estimator's suggestions.
export const ESTIMATOR_DAILY_RATE_PER_DRIVER = 7.8; // €/day
export const ESTIMATOR_FLAT_COST_PER_DRIVER = 200; // € one-time, per driver
