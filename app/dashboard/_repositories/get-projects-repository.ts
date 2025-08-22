import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getProjects(userId: string) {
  try {
    const data = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId));
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}
