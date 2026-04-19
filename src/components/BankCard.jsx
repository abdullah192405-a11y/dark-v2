"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import React from "react";

export default function BankCard({ bank }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('startLoading'));
  };

  return (
    <Link href="/banks" onClick={handleClick} className="block w-full">
      <Card className="relative flex aspect-square w-full flex-col overflow-hidden border border-white/10 bg-white/5 p-0 shadow-sm transition hover:scale-[1.02] hover:shadow-2xl">
        {bank.logoImage ? (
          <>
            {/* Admin logos can be any HTTPS URL; next/image only allows configured hosts. */}
            <img
              src={bank.logoImage}
              alt={bank.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-right">
              <div className="text-sm font-bold text-white drop-shadow-md">{bank.name}</div>
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-[120px] w-full items-center justify-center p-4">
            <div className="text-center font-semibold text-white">{bank.name}</div>
          </div>
        )}
      </Card>
    </Link>
  );
}
