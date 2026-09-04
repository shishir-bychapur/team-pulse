import { z } from "zod";
import { ActionStatus } from "../types/action";

export const actionSchema = z.object({
  ownerId: z.string().nonempty("Owner is invalid!"),
  title: z.string().nonempty("Title cannot be empty!"),
  status: z.enum(ActionStatus, "Status must be of type Open or Closed!"),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format!")
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date!"),
});

export type ActionForm = z.infer<typeof actionSchema>;
