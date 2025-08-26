import { db } from "@/server/db";
import { cards } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getCardsByProjectId(projectId: string) {
  try {
    const data = await db
      .select()
      .from(cards)
      .where(eq(cards.projectId, projectId));

    return data;
  } catch (error) {
    console.log("Error fetching cards:", error);
    return [];
  }
}
