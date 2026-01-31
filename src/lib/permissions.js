import { db } from "./prisma";

export async function checkPermission(userId, permissionId) {
    if (!userId) return false;

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) return false;

    // Admins have all permissions
    if (user.role === "ADMIN") return true;

    // Editors have specific permissions
    if (user.role === "EDITOR") {
        const permissions = user.permissions || [];
        return permissions.includes(permissionId);
    }

    return false;
}
