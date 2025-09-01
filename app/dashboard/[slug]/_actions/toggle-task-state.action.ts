"use server";

import { authActionClient } from "@/lib/safe-action";
import { toggleTaskState } from "../_repositories/toggle-task-state.repository";
import { toggleTaskStateSchema } from "../_schemas/toggle-task-state.schema";

export const toggleTaskStateAction = authActionClient
  .metadata({ actionName: "toggleTaskStateAction" })
  .inputSchema(toggleTaskStateSchema)
  .action(async ({ parsedInput: { cardId, projectId }, ctx: { userId } }) => {
    try {
      await toggleTaskState(cardId, projectId, userId);

      return { success: true };
    } catch (error) {
      console.error("Error toggling task state:", error);
      return {
        success: false,
        serverError: "Failed to toggle task state. Please try again.",
      };
    }
  });
