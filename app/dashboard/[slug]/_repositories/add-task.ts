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
}: {
  title: string;
  // priority: string;
  userId: string;
  cardId: string;
  content: TaskContent;
}) {
  await db.insert(tasks).values({
    id: crypto.randomUUID(),
    projectId: "default-project-id", // Replace with actual projectId as needed
    title,
    cardId,
    dueDate: new Date(),
    userId,
    // description: "default description",
    content,
  });
}
