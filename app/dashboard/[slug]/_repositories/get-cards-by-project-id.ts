import { db } from "@/server/db";
import { cards } from "@/server/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getCardsByProjectId(projectId: string) {
  try {
    const data = await db
      .select()
      .from(cards)
      .where(eq(cards.projectId, projectId))
      .orderBy(asc(cards.createdAt));

    return data;
  } catch (error) {
    console.log("Error fetching cards:", error);
    return [];
  }
}
