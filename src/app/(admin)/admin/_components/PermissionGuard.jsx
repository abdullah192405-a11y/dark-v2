"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ADMIN_ROUTES } from "@/constants/admin-routes";

const PermissionGuard = ({ user, children }) => {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (user?.role === "EDITOR") {
            // Find the route that matches the current pathname
            // Sort by href length descending to match more specific routes first (e.g., /admin/cars before /admin)
            const currentRoute = [...ADMIN_ROUTES]
                .sort((a, b) => b.href.length - a.href.length)
                .find(route =>
                    pathname === route.href || pathname.startsWith(route.href + "/")
                );

            if (currentRoute) {
                // If the route is specifically marked for admins only, block the editor
                if (currentRoute.isAdminOnly) {
                    toast.error("هذه الصفحة متاحة للمدراء فقط");
                    router.push("/admin");
                    return;
                }

                const hasPermission = user.permissions?.includes(currentRoute.id);
                if (!hasPermission) {
                    toast.error("ليس لديك صلاحية للوصول إلى هذه الصفحة");

                    // Find first allowed route
                    const firstAllowed = ADMIN_ROUTES.find(r => user.permissions?.includes(r.id));
                    if (firstAllowed) {
                        router.push(firstAllowed.href);
                    } else {
                        router.push("/"); // No permissions at all
                    }
                }
            } else if (pathname.startsWith("/admin") && pathname !== "/admin") {
                // If it's an admin subpage NOT in our list (like a sub-path), 
                // we should check if they have permission for the parent page.
                // But for now, let's just ensure they are handled.
            }
        }
    }, [pathname, user, router]);

    return <>{children}</>;
};

export default PermissionGuard;
