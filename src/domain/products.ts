export const PRODUCTS = [
  { key: "capuccino", label: "Capuccino" },
  { key: "nescau", label: "Nescau" },
  { key: "cafeGraos", label: "Café (grãos)" },
  { key: "alpino", label: "Alpino" },
] as const;

export type ProductKey = (typeof PRODUCTS)[number]["key"];

export const WEEKDAYS = [
  { key: "MON", label: "Segunda" },
  { key: "WED", label: "Quarta" },
  { key: "FRI", label: "Sexta" },
] as const;

export type AllowedWeekday = (typeof WEEKDAYS)[number]["key"];
