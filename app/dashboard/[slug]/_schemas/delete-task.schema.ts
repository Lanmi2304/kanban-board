import { z } from "zod";

export const deleteTaskSchema = z.object({
  taskId: z.string().min(1, "Task id is required"),
});

export type DeleteTaskSchemaInput = z.infer<typeof deleteTaskSchema>;
