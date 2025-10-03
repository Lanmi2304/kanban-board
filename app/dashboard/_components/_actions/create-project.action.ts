"use server";

import { db } from "@/server/db";
import { createProjectSchema } from "../../_schemas/create-project.schema";
import { InsertCards, cards, projects } from "@/server/db/schema";
import { authActionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

export const createNewProjectAction = authActionClient
  .metadata({ actionName: "createNewProject" })
  .inputSchema(createProjectSchema)
  .action(async ({ parsedInput: { title, description }, ctx: { userId } }) => {
    const projectId = crypto.randomUUID();
    const DEFAULT_CARDS: InsertCards[] = [
      {
        id: `${projectId}-to-do`,
        title: "To Do",
        userId,
        projectId,
      },
      {
        id: `${projectId}-doing`,
        title: "Doing",
        userId,
        projectId,
      },
      {
        id: `${projectId}-done`,
        title: "Done",
        userId,
        projectId,
      },
    ];

    await db.insert(projects).values({
      id: projectId,
      title,
      description,
      userId,
    });

    await db.insert(cards).values(DEFAULT_CARDS);

    revalidatePath(`/dashboard`);

    return {
      success: true,
    };
  });
