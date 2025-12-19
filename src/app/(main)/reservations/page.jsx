import { getUserTestDrives } from "@/actions/test-drive";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import ReservationsList from "./_components/ReservationsList";

export const metadata = {
  title: "حجوزاتي | Click Car",
  description: "إدارة حجوزات اختبار القيادة الخاصة بك",
};

const ReservationsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/reservations");
  }

  const reservationsResult = await getUserTestDrives();
  console.log(reservationsResult);

  return (
    <div className="w-full px-0 py-12">
      <h1 className="text-2xl md:text-4xl mb-6 gradient-title">حجوزاتك</h1>{" "}
      <ReservationsList initialData={reservationsResult} />
    </div>
  );
};

export default ReservationsPage;
