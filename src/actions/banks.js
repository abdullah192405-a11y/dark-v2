"use server";

import { db } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getBanks = unstable_cache(
  async () => {
    const banks = await db.bank.findMany({
      orderBy: { createdAt: "desc" },
    });

    const serializedBanks = banks.map((bank) => ({
      ...bank,
      interestRate: bank.interestRate ? parseFloat(bank.interestRate.toString()) : 0,
      createdAt: bank.createdAt instanceof Date ? bank.createdAt.toISOString() : bank.createdAt,
      updatedAt: bank.updatedAt instanceof Date ? bank.updatedAt.toISOString() : bank.updatedAt,
    }));

    return { success: true, data: serializedBanks };
  },
  // Bumped key so old entries that cached DB-failure fallbacks are not reused
  ["home-banks"],
  { revalidate: 3600, tags: ["banks"] }
);
