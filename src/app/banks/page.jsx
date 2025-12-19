import React from "react";
import BankCard from "@/components/BankCard";
import { db } from "@/lib/prisma";
import Link from "next/link";

export default async function BanksPage() {
  let banks = [];
  try {
    banks = await db.bank.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("Error fetching banks for /banks page:", error.message);
  }

  return (
    <div className="pt-20 pb-12 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <section className="py-12 px-6 md:px-12">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            العروض التمويلية
          </h1>
          <p className="text-yellow-600 text-base max-w-2xl mx-auto">
            اكتشف جميع العروض التمويلية المتاحة لتمويل سيارتك
          </p>
        </div>
      </section>

        {banks.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center text-gray-300">
            لا توجد بنوك متاحة حالياً
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {banks.map((bank) => (
              <div key={bank.id} className="h-full w-full">
                <BankCard bank={bank} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
