import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getTasksByProjectId(projectId: string) {
  try {
    const data = await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId));
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}
