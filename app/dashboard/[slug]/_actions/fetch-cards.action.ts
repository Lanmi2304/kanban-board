"use server";

import { getCardsByProjectId } from "@/app/dashboard/[slug]/_repositories/get-cards-by-project-id";

export async function fetchCardsByProjectId(projectId: string) {
  try {
    // Call the server-side repository function
    const cards = await getCardsByProjectId(projectId);
    return cards;
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw new Error("Failed to fetch cards");
  }
}
