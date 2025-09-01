import z from "zod";

export const toggleTaskStateSchema = z.object({
  cardId: z.string().min(1),
  projectId: z.string().min(1),
});

export type ToggleTaskStateInput = z.infer<typeof toggleTaskStateSchema>;
