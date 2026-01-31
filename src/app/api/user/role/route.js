import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("GET /api/user/role called");

  try {
    // Check if Clerk is properly configured
    console.log("Checking Clerk env vars...");
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
      console.error("Clerk environment variables are not configured");
      return NextResponse.json({ error: "Clerk not configured" }, { status: 500 });
    }
    console.log("Clerk env vars OK");

    console.log("Calling currentUser...");
    const user = await currentUser();
    console.log("currentUser result:", user ? "user found" : "no user");

    if (!user) {
      return NextResponse.json({ role: null });
    }

    // finding if the currentUser is present User-table
    console.log("Querying database for user...");
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });
    console.log("Database query result:", loggedInUser ? "user found" : "user not found");

    // if a user is found return it otherwise create a new user
    if (loggedInUser) {
      return NextResponse.json({ role: loggedInUser.role });
    }

    // user not found so create or update user
    console.log("Creating or updating user...");
    const newUser = await db.user.upsert({
      where: {
        email: user.emailAddresses?.[0]?.emailAddress,
      },
      update: {
        clerkUserId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        imageUrl: user.imageUrl,
        phone: user.phoneNumbers?.[0]?.phoneNumber ?? null,
      },
      create: {
        clerkUserId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        imageUrl: user.imageUrl,
        email: user.emailAddresses?.[0]?.emailAddress,
        phone: user.phoneNumbers?.[0]?.phoneNumber ?? null,
      },
    });
    console.log("User created/updated:", newUser.id);
    return NextResponse.json({ role: newUser.role });
  } catch (error) {
    console.error("GetUserRole error:", error.message || error, error.stack);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
