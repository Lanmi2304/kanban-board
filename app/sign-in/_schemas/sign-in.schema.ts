import { z } from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export type SignInSchemaInput = z.infer<typeof signInSchema>;
