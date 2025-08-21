import { auth } from "@/server/auth";
import { headers } from "next/headers";

export async function getSession() {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    return sessionData;
  } catch (error) {
    console.log("Error getting session:", error);
    return null;
  }
}
