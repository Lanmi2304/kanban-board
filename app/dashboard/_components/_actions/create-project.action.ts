"use server";

import { db } from "@/server/db";
import { createProjectSchema } from "../../_schemas/create-project.schema";
import { projects } from "@/server/db/schema";
import { authActionClient } from "@/lib/safe-action";

export const createNewProjectAction = authActionClient
  .metadata({ actionName: "createNewProject" })
  .inputSchema(createProjectSchema)
  .action(async ({ parsedInput: { title, description }, ctx: { userId } }) => {
    await db.insert(projects).values({
      id: crypto.randomUUID(),
      title,
      description,
      userId,
    });

    console.log(userId);
    return {
      success: true,
    };
  });
