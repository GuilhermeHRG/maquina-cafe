import { z } from "zod";
import { PRODUCTS, WEEKDAYS } from "./products";

const productKeys = PRODUCTS.map((p) => p.key) as [string, ...string[]];
const weekdayKeys = WEEKDAYS.map((w) => w.key) as [string, ...string[]];


export const createLogSchema = z.object({
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/), 
  weekday: z.enum(weekdayKeys),
  cleaned: z.boolean(),
  cleanedBy: z.string().trim().min(2, "Informe quem limpou"),
  restocked: z.record(z.enum(productKeys), z.boolean()),
  notes: z.string().trim().optional(),
});

export type CreateLogSchema = z.infer<typeof createLogSchema>;
