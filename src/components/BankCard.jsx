"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function BankCard({ bank }) {
  return (
    <Card className="bg-white/5/5 border border-white/10 rounded-2xl overflow-hidden transition aspect-square w-full p-0 hover:scale-[1.02] hover:shadow-2xl">
      {bank.logoImage ? (
        <div className="relative w-full h-full">
          <Image src={bank.logoImage} alt={bank.name} fill className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
          <div className="absolute left-0 right-0 bottom-0 p-4 text-right">
            <div className="text-white font-bold text-sm drop-shadow-md">{bank.name}</div>
            {/* <div className="text-xs text-white/80 mt-1">
              {bank.interestRate !== undefined && bank.interestRate !== null
                ? `${typeof bank.interestRate === 'number' ? bank.interestRate.toFixed(2) : parseFloat(bank.interestRate).toFixed(2)}%`
                : "بدون سعر فائدة"}
            </div> */}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-white font-semibold">{bank.name}</div>
        </div>
      )}
    </Card>
  );
}
