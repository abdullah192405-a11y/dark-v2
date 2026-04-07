"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "./ui/card";

const FeaturedBrandCard = ({ brand }) => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("startLoading"));
  };

  return (
    <Card className="bg-black/50 backdrop-blur-lg bg-white/20 rounded-md shadow-xl p-4 flex items-center justify-center hover:shadow-2xl transition cursor-pointer border border-white/20 h-32">
      <Link href={`/cars?make=${brand.name}`} className="w-full h-full relative" onClick={handleClick}>
        <Image
          src={brand.image}
          alt={brand.nameAr}
          fill
          style={{ objectFit: "contain" }}
          className="rounded-md"
          priority
        />
      </Link>
    </Card>
  );
};

export default FeaturedBrandCard;
