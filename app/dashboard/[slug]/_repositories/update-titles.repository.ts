import { db } from "@/server/db";
import { cards, projects } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function updateProjectTittle({
  projectId,
  newTitle,
  userId,
}: {
  projectId: string;
  newTitle: string;
  userId: string;
}) {
  await db
    .update(projects)
    .set({ title: newTitle })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
}

export async function updateCardTitle({
  projectId,
  newTitle,
  userId,
}: {
  projectId: string;
  newTitle: string;
  userId: string;
}) {
  await db
    .update(cards)
    .set({ title: newTitle })
    .where(and(eq(cards.id, projectId), eq(cards.userId, userId)));
}
