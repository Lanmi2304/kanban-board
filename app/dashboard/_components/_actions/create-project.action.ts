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
        id: "ready",
        title: "Ready",
        description: "This is ready to be picked up",
        userId,
        projectId,
      },
      {
        id: "in-progress",
        title: "In Progress",
        description: "This task is currently being worked on",
        userId,
        projectId,
      },
      {
        id: "in-review",
        title: "In Review",
        description: "This task is currently being reviewed",
        userId,
        projectId,
      },
      {
        id: "done",
        title: "Done",
        description: "This task is completed",
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
