"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getUserRole() {
  try {
    // Check if Clerk is properly configured
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
      console.error("Clerk environment variables are not configured");
      return null;
    }

    const user = await currentUser();

    if (!user) {
      return null;
    }

    // finding if the currentUser is present User-table
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    // if a user is found return it otherwise create a new user
    if (loggedInUser) return loggedInUser.role;

    // user not found so create a newUser
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        phone: user.phoneNumbers?.[0]?.phoneNumber ?? null,
      },
    });
    return newUser.role;
  } catch (error) {
    console.error("GetUserRole error:", error.message || error);
    // Return null instead of throwing to prevent breaking the app
    return null;
  }
}
