import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";

// Define the expected content type based on your schema
type TaskContent = {
  type: string;
  content: {
    type: string;
    content?: unknown[];
    attrs?: Record<string, unknown>;
  }[];
};

export async function addTask({
  title,
  userId,
  cardId,
  content,
  projectId,
}: {
  title: string;
  // priority: string;
  userId: string;
  cardId: string;
  projectId: string;
  content: TaskContent;
}) {
  // Note: We're accepting the cardId as-is, even if it contains status indicators
  // like "-ready" since our schema doesn't enforce foreign key constraints

  await db.insert(tasks).values({
    id: crypto.randomUUID(),
    projectId: projectId,
    title,
    cardId,
    dueDate: new Date(),
    userId,
    content,
  });
}
