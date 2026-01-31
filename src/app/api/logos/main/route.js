import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch the main/about logo from the database
    const mainLogo = await db.logo.findFirst({
      where: { type: "main", isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!mainLogo) {
      // Return default if none found
      return NextResponse.json({
        success: true,
        data: {
          imageUrl: "/logo.jpg",
          altText: "Main Logo",
          type: "main",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: mainLogo,
    });
  } catch (error) {
    console.error("Error fetching main logo:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
