import { auth } from "@clerk/nextjs/server";
import { db } from "./prisma";

export async function getAuthenticatedUser() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await db.User.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) return null;

    return user;
  } catch (error) {
    console.error(`Error in getAuthenticatedUser helper -> ${error.message}`);
    return null;
  }
}
