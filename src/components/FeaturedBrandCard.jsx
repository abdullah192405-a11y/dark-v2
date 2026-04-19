"use client";

import Link from "next/link";
import { Card } from "./ui/card";

const FeaturedBrandCard = ({ brand }) => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("startLoading"));
  };

  return (
    <Card className="flex h-32 cursor-pointer items-center justify-center rounded-md border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-lg transition hover:shadow-2xl">
      <Link
        href={`/cars?make=${encodeURIComponent(brand.name)}`}
        className="relative flex h-full w-full items-center justify-center"
        onClick={handleClick}
      >
        <img
          src={brand.image}
          alt={brand.nameAr || brand.name}
          className="max-h-full max-w-full rounded-md object-contain"
          loading="lazy"
          decoding="async"
        />
      </Link>
    </Card>
  );
};

export default FeaturedBrandCard;
