"use server";
import { authActionClient } from "@/lib/safe-action";
import { deleteTaskSchema } from "../../_schemas/delete-task.schema";
import { deleteTask } from "../_repositories/delete-task.repository";

export const deleteTaskAction = authActionClient
  .metadata({ actionName: "deleteTaskAction" })
  .inputSchema(deleteTaskSchema)
  .action(async ({ parsedInput: { taskId }, ctx: { userId } }) => {
    try {
      await deleteTask(taskId, userId);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  });
