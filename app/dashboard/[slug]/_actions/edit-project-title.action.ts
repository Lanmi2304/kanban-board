"use server";

import { authActionClient } from "@/lib/safe-action";
import z from "zod";
import {
  updateCardTitle,
  updateProjectTittle,
} from "../_repositories/update-titles.repository";

const editProjectTitleSchema = z.object({
  projectId: z.string().min(1),
  newTitle: z.string().min(1).max(100),
});

export const editProjectTitleAction = authActionClient
  .metadata({ actionName: "editProjectTitleAction" })
  .inputSchema(editProjectTitleSchema)
  .action(async ({ parsedInput: { newTitle, projectId }, ctx: { userId } }) => {
    try {
      await updateProjectTittle({
        projectId,
        newTitle,
        userId,
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating project title:", error);
      return {
        success: false,
        serverError: "Failed to update project title. Please try again.",
      };
    }
  });

export const editCardTitleAction = authActionClient
  .metadata({ actionName: "editCardTitleAction" })
  .inputSchema(editProjectTitleSchema)
  .action(async ({ parsedInput: { newTitle, projectId }, ctx: { userId } }) => {
    try {
      await updateCardTitle({
        projectId,
        newTitle,
        userId,
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating project title:", error);
      return {
        success: false,
        serverError: "Failed to update project title. Please try again.",
      };
    }
  });
