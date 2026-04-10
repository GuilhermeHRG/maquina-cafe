export const PRODUCTS = [
  { key: "capuccino", label: "Capuccino" },
  { key: "nescau", label: "Nescau" },
  { key: "cafeGraos", label: "Café (grãos)" },
  { key: "alpino", label: "Alpino" },
] as const;

export type ProductKey = (typeof PRODUCTS)[number]["key"];

export const WEEKDAYS = [
  { key: "SUN", label: "Domingo" },
  { key: "MON", label: "Segunda" },
  { key: "TUE", label: "Terça" },
  { key: "WED", label: "Quarta" },
  { key: "THU", label: "Quinta" },
  { key: "FRI", label: "Sexta" },
  { key: "SAT", label: "Sábado" },
] as const;

export type AllowedWeekday = (typeof WEEKDAYS)[number]["key"];