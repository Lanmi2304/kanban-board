import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(1).max(100),
    email: z.email(),
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
    image: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpSchemaInput = z.infer<typeof signUpSchema>;
