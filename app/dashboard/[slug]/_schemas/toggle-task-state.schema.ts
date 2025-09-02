import z from "zod";

// NOTE: Confusing naming here:
// - cardId is actually the task ID to update
// - projectId is actually the new card ID to move the task to
export const toggleTaskStateSchema = z.object({
  taskId: z.string().min(1), // This is the task ID
  newCardId: z.string().min(1), // This is the new card ID
});

export type ToggleTaskStateInput = z.infer<typeof toggleTaskStateSchema>;
