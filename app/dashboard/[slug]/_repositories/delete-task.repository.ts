import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function deleteTask(taskId: string, userId: string) {
  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}
