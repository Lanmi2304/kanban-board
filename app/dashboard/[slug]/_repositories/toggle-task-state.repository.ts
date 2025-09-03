import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function toggleTaskState(
  taskId: string,
  newCardId: string,
  userId: string,
) {
  await db
    .update(tasks)
    .set({ cardId: newCardId })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}
