import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch the favicon logo from the database
    const faviconLogo = await db.logo.findFirst({
      where: { type: "favicon", isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!faviconLogo) {
      // Return default favicon if none found in database
      return NextResponse.json({
        success: true,
        data: {
          imageUrl: "/logo1.png",
          altText: "Site Favicon",
          type: "favicon",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: faviconLogo,
    });
  } catch (error) {
    console.error("Error fetching favicon:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
