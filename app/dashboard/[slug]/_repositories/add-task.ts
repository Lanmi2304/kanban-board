import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";
import { AddTaskPayload } from "../_types";

export async function addTask({
  title,
  userId,
  cardId,
  content,
  projectId,
}: AddTaskPayload) {
  await db.insert(tasks).values({
    id: crypto.randomUUID(),
    projectId: projectId,
    title,
    cardId,
    dueDate: new Date(),
    userId: userId || "",
    content,
  });
}
