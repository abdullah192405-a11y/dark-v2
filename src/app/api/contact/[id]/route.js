import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if contact exists
    const contact = await db.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    // Delete the contact
    await db.contact.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error(`Error while deleting contact: ${error}`);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
