import z from "zod";

export const addTaskSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  content: z.object({
    type: z.string(),
    content: z.array(
      z.object({
        type: z.string(),
        content: z.array(z.unknown()).optional(),
        attrs: z.any().optional(),
      }),
    ),
  }),
});

export type AddTaskInput = z.infer<typeof addTaskSchema>;
