import { getDashboardData } from "@/actions/admin";
import React from "react";
import Dashboard from "./_components/Dashboard";

export const metadata = {
  title: "لوحة التحكم | Click Car Admin",
  description: "لوحة تحكم المسؤول لسوق السيارات Click Car",
};

const AdminPage = async () => {
  const dashboardData = await getDashboardData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-right">لوحة التحكم</h1>
      <Dashboard initialData={dashboardData} />
    </div>
  );
};

export default AdminPage;
