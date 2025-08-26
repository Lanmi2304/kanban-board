import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getProjectById(id: string) {
  const project = await db.select().from(projects).where(eq(projects.id, id));
  return project[0];
}
