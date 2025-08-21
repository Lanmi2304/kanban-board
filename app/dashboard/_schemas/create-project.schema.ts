import z from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
});

export type CreateProjectSchemaInput = z.infer<typeof createProjectSchema>;
