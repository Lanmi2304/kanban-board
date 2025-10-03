"use server";
import { authActionClient } from "@/lib/safe-action";
import { deleteBoardSchema } from "../../_schemas/delete-board.schema";
import { deleteBoardRepository } from "../_repositories/delete-borad.repository";

export const deleteBoardAction = authActionClient
  .metadata({ actionName: "deleteBoardAction" })
  .inputSchema(deleteBoardSchema)
  .action(async ({ parsedInput: { boardId }, ctx: { userId } }) => {
    try {
      await deleteBoardRepository(boardId, userId);
    } catch (error) {
      console.error("Error deleting board:", error);
      throw error;
    }
  });
