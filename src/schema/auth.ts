import { z } from "zod";

export const authSchema = z.object({
  username: z.email({ error: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { error: "Password cannot be empty!" }).trim(),
});

export type AuthForm = z.infer<typeof authSchema>;
