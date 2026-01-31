"use server";

import { db } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getBanks = unstable_cache(
  async () => {
    try {
      const banks = await db.bank.findMany({
        orderBy: { createdAt: "desc" },
      });

      // Serialize data for Client Components (Decimal -> Number, Date -> String)
      const serializedBanks = banks.map(bank => ({
        ...bank,
        interestRate: bank.interestRate ? parseFloat(bank.interestRate.toString()) : 0,
        createdAt: bank.createdAt instanceof Date ? bank.createdAt.toISOString() : bank.createdAt,
        updatedAt: bank.updatedAt instanceof Date ? bank.updatedAt.toISOString() : bank.updatedAt,
      }));

      return { success: true, data: serializedBanks };
    } catch (error) {
      console.error("Error fetching banks:", error);
      return { success: false, error: error.message };
    }
  },
  ["all-banks"],
  { revalidate: 3600, tags: ["banks"] }
);
