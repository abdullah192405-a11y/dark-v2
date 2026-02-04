"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { checkPermission } from "@/lib/permissions";

export async function getMandebs() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const hasPermission = await checkPermission(userId, "mandebs");
        if (!hasPermission) throw new Error("Unauthorized access");

        const mandebs = await db.mandeb.findMany({
            orderBy: { createdAt: "desc" },
        });

        return {
            success: true,
            data: mandebs,
        };
    } catch (error) {
        console.error("Error in getMandebs:", error.message);
        return {
            success: false,
            error: error.message,
        };
    }
}

export async function getPublicMandebs() {
    try {
        const mandebs = await db.mandeb.findMany({
            orderBy: { name: "asc" },
        });

        return {
            success: true,
            data: mandebs,
        };
    } catch (error) {
        console.error("Error in getPublicMandebs:", error.message);
        return {
            success: false,
            error: error.message,
        };
    }
}

export async function createMandeb(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const hasPermission = await checkPermission(userId, "mandebs");
        if (!hasPermission) throw new Error("Unauthorized access");

        const mandeb = await db.mandeb.create({
            data: {
                name: data.name,
                phone: data.phone,
                city: data.city,
            },
        });

        revalidatePath("/admin/mandebs");

        return {
            success: true,
            data: mandeb,
        };
    } catch (error) {
        console.error("Error in createMandeb:", error.message);
        return {
            success: false,
            error: error.message,
        };
    }
}

export async function updateMandeb(id, data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const hasPermission = await checkPermission(userId, "mandebs");
        if (!hasPermission) throw new Error("Unauthorized access");

        const mandeb = await db.mandeb.update({
            where: { id },
            data: {
                name: data.name,
                phone: data.phone,
                city: data.city,
            },
        });

        revalidatePath("/admin/mandebs");

        return {
            success: true,
            data: mandeb,
        };
    } catch (error) {
        console.error("Error in updateMandeb:", error.message);
        return {
            success: false,
            error: error.message,
        };
    }
}

export async function deleteMandeb(id) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const hasPermission = await checkPermission(userId, "mandebs");
        if (!hasPermission) throw new Error("Unauthorized access");

        await db.mandeb.delete({
            where: { id },
        });

        revalidatePath("/admin/mandebs");

        return {
            success: true,
        };
    } catch (error) {
        console.error("Error in deleteMandeb:", error.message);
        return {
            success: false,
            error: error.message,
        };
    }
}
