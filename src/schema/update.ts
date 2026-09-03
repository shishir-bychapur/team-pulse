import { z } from "zod";
import { Mood } from "../types/update";

export const updateSchema = z.object({
  memberId: z.string().nonempty(),
  text: z.string().nonempty(),
  mood: z.enum(Mood),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
});
