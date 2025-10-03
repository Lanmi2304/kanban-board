import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function deleteBoardRepository(boardId: string, userId: string) {
  await db
    .delete(projects)
    .where(and(eq(projects.id, boardId), eq(projects.userId, userId)));
}
