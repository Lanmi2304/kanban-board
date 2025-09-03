import z from "zod";

export const toggleTaskStateSchema = z.object({
  taskId: z.string().min(1),
  newCardId: z.string().min(1),
});

export type ToggleTaskStateInput = z.infer<typeof toggleTaskStateSchema>;
