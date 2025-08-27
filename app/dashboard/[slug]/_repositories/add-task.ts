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
  priority,
  userId,
  content,
}: {
  title: string;
  priority: string;
  userId: string;
  content: TaskContent;
}) {
  await db.insert(tasks).values({
    title,
    priority,
    userId,
    content,
  });
}
