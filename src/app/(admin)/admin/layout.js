import { getAdmin } from "@/actions/admin";
import Header from "@/components/header";
import { notFound } from "next/navigation";
import React from "react";
import Sidebar from "./_components/Sidebar";
import PermissionGuard from "./_components/PermissionGuard";
import { getLogoByType } from "@/actions/site-management";

export const dynamic = 'force-dynamic';

const AdminLayout = async ({ children }) => {
  const [admin, navLogoRes] = await Promise.all([
    getAdmin(),
    getLogoByType("navbar")
  ]);

  if (!admin.authorized) {
    return notFound(); //not found page
  }

  const navLogo = navLogoRes?.data;

  return (
    <div className="h-full">
      {/* Overlapping header page here to avoid making it a client component */}
      <Header isAdminPage={true} navLogo={navLogo} />

      <div className="flex h-full w-56 flex-col top-20 fixed inset-y-0 z-50 right-0">
        <Sidebar user={admin.user} />
      </div>
      <main className="md:pr-56 pt-[80px] h-full">
        <PermissionGuard user={admin.user}>
          {children}
        </PermissionGuard>
      </main>
    </div>
  );
};

export default AdminLayout;
