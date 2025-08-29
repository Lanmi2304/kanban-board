"use server";

import { authActionClient } from "@/lib/safe-action";
import { addTaskSchema } from "../_schemas/add-task.schema";
import { addTask } from "../_repositories/add-task";

export const addTaskAction = authActionClient
  .metadata({ actionName: "addTaskAction" })
  .inputSchema(addTaskSchema)
  .action(
    async ({
      parsedInput: { title, content, cardId, projectId },
      ctx: { userId },
    }) => {
      try {
        // Ensure the content is properly structured
        const cleanContent = JSON.parse(JSON.stringify(content));

        await addTask({
          title,
          userId,
          projectId,
          cardId,
          content: cleanContent,
        });

        return { success: true };
      } catch (error) {
        console.error("Error adding task:", error);
        return {
          success: false,
          serverError: "Failed to add task. Please try again.",
        };
      }
    },
  );
