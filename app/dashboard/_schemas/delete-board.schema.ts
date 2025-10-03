import z from "zod";

export const deleteBoardSchema = z.object({
  boardId: z.string().min(1),
});

export type DeleteBoardInput = z.infer<typeof deleteBoardSchema>;
