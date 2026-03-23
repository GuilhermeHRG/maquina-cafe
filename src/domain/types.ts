import type { AllowedWeekday, ProductKey } from "./products";

export type Inventory = {
  items: Record<ProductKey, string>;
  updatedAt?: Date;
};

export type CreateCoffeeLogInput = {
  date: string;
  weekday: AllowedWeekday;
  cleaned: boolean;
  cleanedBy: string;
  restocked: Record<ProductKey, boolean>;
  notes?: string;
};

export type CoffeeLog = {
  id: string;
  date: string; // DD/MM/YYYY
  weekday: AllowedWeekday;
  cleaned: boolean;
  cleanedBy: string;
  restocked: Record<ProductKey, boolean>;
  notes?: string;
  createdAt?: Date | null;
};