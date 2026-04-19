"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import LinkWithLoader from "@/components/LinkWithLoader";
import { Card } from "@/components/ui/card";

export default function FeaturedModelCard({ model }) {
  const href = `/cars?bodyType=${encodeURIComponent(model.name)}`;

  return (
    <LinkWithLoader href={href}>
      <Card className="relative group cursor-pointer rounded-2xl overflow-hidden h-48 md:h-64 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-0">
        <div className="relative h-full w-full">
          <Image
            src={model.image}
            alt={model.nameAr}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 text-right">
          <h3 className="text-white font-bold text-xl mb-2 drop-shadow-lg">{model.nameAr}</h3>
          <div className="flex items-center text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity justify-end">
            <span>استكشف المزيد</span>
            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </LinkWithLoader>
  );
}
