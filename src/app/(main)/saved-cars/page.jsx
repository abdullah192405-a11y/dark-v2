import { getSavedCars } from "@/actions/car-listing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import React from "react";
import { SavedCarsList } from "./_components/SavedCarsList";

const SavedCarsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/saved-cars");
  }

  const savedCarsResult = await getSavedCars();
  console.log(savedCarsResult);

  return (
    <div className="w-full px-0 py-12">
      <h1 className="text-2xl md:text-4xl mb-6 gradient-title">سياراتك المحفوظة</h1>
      <SavedCarsList initialData={savedCarsResult} />
    </div>
  );
};

export default SavedCarsPage;
