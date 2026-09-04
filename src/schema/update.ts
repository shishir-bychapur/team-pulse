import { z } from "zod";
import { Mood } from "../types/update";

export const updateSchema = z.object({
  memberId: z.string().nonempty("Member is invalid!"),
  text: z.string().nonempty("Update text cannot be empty!"),
  mood: z.enum(Mood, "Mood must be of type Red, Yellow or Green!"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format!")
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date!"),
});

export type UpdateForm = z.infer<typeof updateSchema>;
