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

    // Get role from Clerk metadata if available
    const clerkRole = user.publicMetadata?.role;
    const initialRole = (clerkRole === "ADMIN" || clerkRole === "EDITOR") ? clerkRole : "USER";

    // if a user is found return it
    if (loggedInUser) {
      console.log("Found existing user with role:", loggedInUser.role);

      // If DB has USER but Clerk has ADMIN/EDITOR, sync to DB
      if (loggedInUser.role === "USER" && initialRole !== "USER") {
        console.log("Syncing role from Clerk to DB:", initialRole);
        const updatedUser = await db.user.update({
          where: { id: loggedInUser.id },
          data: { role: initialRole }
        });
        return NextResponse.json({ role: updatedUser.role });
      }

      return NextResponse.json({ role: loggedInUser.role });
    }

    // user not found by clerkUserId, so create or update user by email
    console.log("Creating or updating user with initial role:", initialRole);
    const newUser = await db.user.upsert({
      where: {
        email: user.emailAddresses?.[0]?.emailAddress,
      },
      update: {
        clerkUserId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        imageUrl: user.imageUrl,
        phone: user.phoneNumbers?.[0]?.phoneNumber ?? null,
        // Update role if Clerk has a specific role (ADMIN/EDITOR)
        ...(clerkRole === "ADMIN" || clerkRole === "EDITOR" ? { role: clerkRole } : {})
      },
      create: {
        clerkUserId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        imageUrl: user.imageUrl,
        email: user.emailAddresses?.[0]?.emailAddress,
        phone: user.phoneNumbers?.[0]?.phoneNumber ?? null,
        role: initialRole,
      },
    });
    console.log("User created/updated with role:", newUser.role);
    return NextResponse.json({ role: newUser.role });
  } catch (error) {
    console.error("GetUserRole error:", error.message || error, error.stack);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
