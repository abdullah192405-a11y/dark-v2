"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import React from "react";

export default function BankCard({ bank }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('startLoading'));
  };

  return (
    <Link href="/banks" onClick={handleClick}>
      <Card className="bg-white/5/5 border border-white/10 rounded-2xl overflow-hidden transition aspect-square w-full p-0 hover:scale-[1.02] hover:shadow-2xl">
        {bank.logoImage ? (
          <div className="relative w-full h-full">
            <Image src={bank.logoImage} alt={bank.name} fill className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
            <div className="absolute left-0 right-0 bottom-0 p-4 text-right">
              <div className="text-white font-bold text-sm drop-shadow-md">{bank.name}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-white font-semibold">{bank.name}</div>
          </div>
        )}
      </Card>
    </Link>
  );
}
