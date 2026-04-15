"use server";

import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDealershipInfo() {
  try {
    // check if user is authorizsed
    const user = await getAuthenticatedUser();

    // Get the dealership record
    let dealership = await db.DealershipInfo.findFirst({
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });

    // If no dealership exists, create a default one
    if (!dealership) {
      dealership = await db.dealershipInfo.create({
        data: {
          // Default values will be used from schema
          workingHours: {
            create: [
              {
                dayOfWeek: "MONDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "TUESDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "WEDNESDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "THURSDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "FRIDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "SATURDAY",
                openTime: "10:00",
                closeTime: "16:00",
                isOpen: true,
              },
              {
                dayOfWeek: "SUNDAY",
                openTime: "10:00",
                closeTime: "16:00",
                isOpen: false,
              },
            ],
          },
        },
        include: {
          workingHours: {
            orderBy: {
              dayOfWeek: "asc",
            },
          },
        },
      });
    }

    return {
      success: true,
      data: {
        ...dealership,
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error(
      `Error in getDealerShipInfo server action -> ${error.message}`
    );
    return {
      success: false,
    };
  }
}

export async function updateDealershipInfo(data) {
  try {
    const user = await getAuthenticatedUser();
    if (user?.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }

    let dealership = await db.dealershipInfo.findFirst();

    if (!dealership) {
      dealership = await db.dealershipInfo.create({
        data: {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
        },
      });
    } else {
      dealership = await db.dealershipInfo.update({
        where: { id: dealership.id },
        data: {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
        },
      });
    }

    // Also sync with StoreInfo to ensure Footer and other components are updated
    const storeInfo = await db.storeInfo.findFirst();
    if (storeInfo) {
      await db.storeInfo.update({
        where: { id: storeInfo.id },
        data: {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
        },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/admin/site-data");
    revalidatePath("/", "layout");
    revalidatePath("/");

    return {
      success: true,
      data: dealership,
    };
  } catch (error) {
    console.error("Error updating dealership info:", error);
    return { success: false, error: error.message };
  }
}

export async function saveWorkingHours(workingHours) {
  try {
    // check if user is authorizsed
    const user = await getAuthenticatedUser();
    if (user?.role !== "ADMIN") {
      throw new Error("Unauthorized : Admin access required");
    }

    // Get current dealership info
    const dealership = await db.dealershipInfo.findFirst();
    if (!dealership) {
      throw new Error("Dealership info not found");
    }

    //update dealership hours-first deleteexisting hours
    await db.workingHour.deleteMany({
      where: { dealershipId: dealership.id },
    });

    // Then create new hours
    for (const hour of workingHours) {
      await db.workingHour.create({
        data: {
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isOpen: hour.isOpen,
          dealershipId: dealership.id,
        },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error(`Error in saveWorkingHours server action -> ${error}`);
    return {
      success: false,
    };
  }
}

export async function getUsers() {
  try {
    const user = await getAuthenticatedUser();
    if (user?.role !== "ADMIN") {
      throw new Error("Unauthorized : Admin access required");
    }

    // get all users
    const users = await db.User.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error(`Error in getUsers server action -> ${error.message}`);
    return {
      success: false,
    };
  }
}

export async function updateUserRole(userId, role) {
  try {
    const user = await getAuthenticatedUser();
    if (user?.role !== "ADMIN") {
      throw new Error("Unauthorised : Admin access required");
    }

    // Validate role
    const validRoles = ["USER", "ADMIN", "EDITOR"];
    if (!validRoles.includes(role)) {
      throw new Error("Invalid role");
    }

    await db.User.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return {
      success: true,
    };
  } catch (error) {
    console.error(`Error in updateUserRole server action ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateUserPermissions(userId, permissions) {
  try {
    const user = await getAuthenticatedUser();
    if (user?.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }

    await db.User.update({
      where: { id: userId },
      data: { permissions },
    });

    revalidatePath("/admin/settings");
    return {
      success: true,
    };
  } catch (error) {
    console.error(`Error in updateUserPermissions server action: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
}
