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
  { value: "RECENT", label: "Récent (- de 3 ans)" },
  { value: "OCCASION", label: "Occasion (3-10 ans)" },
  { value: "ANCIEN", label: "Ancien (+ de 10 ans)" },
] as const;
