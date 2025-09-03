"use server";

import { getTasksByProjectId } from "@/app/dashboard/[slug]/_repositories/get-tasks-by-project-id";

export async function fetchTasksByProjectId(projectId: string) {
  try {
    // Call the server-side repository function
    const tasks = await getTasksByProjectId(projectId);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
}
