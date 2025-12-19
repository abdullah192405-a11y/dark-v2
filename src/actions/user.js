import { checkUser } from "@/lib/checkUser";

export async function getUserRole() {
  try {
    const user = await checkUser();
    return user?.role || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}
