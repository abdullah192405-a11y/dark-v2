"use client";
import { cn } from "@/lib/utils";
import { Calendar, Car, Cog, Heart, LayoutDashboard, MessageSquare, Award, Home, FileText, Mail, DollarSign } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const routes = [
  { label: "لوحة التحكم", icon: LayoutDashboard, href: "/admin" },
  { label: "السيارات", icon: Car, href: "/admin/cars" },
  { label: "العلامات التجارية", icon: Award, href: "/admin/featured-brands" },
  { label: "الموديلات المميزة", icon: Award, href: "/admin/featured-models" },
  { label: "اختبارات القيادة", icon: Calendar, href: "/admin/test-drives" },
  { label: "تحليلات الدردشة", icon: MessageSquare, href: "/admin/chat-analytics" },
  { label: "طلبات القروض", icon: DollarSign, href: "/admin/loan-requests" },
  { label: "الإعدادات", icon: Cog, href: "/admin/settings" },
  { label: "البنك", icon: Home, href: "/admin/bank" },
  { label: "المقالات", icon: FileText, href: "/admin/articles" },
  { label: "التقييمات", icon: MessageSquare, href: "/admin/reviews" },
  { label: "الرسائل", icon: Mail, href: "/admin/contacts" },
  { label: "السيارات المحفوظة", icon: Heart, href: "/saved-cars" },
];

const Sidebar = () => {
  const pathName = usePathname();
  return (
    <>
      {/* Sidebar for bigger screens */}
      <div className="hidden md:flex h-full flex-col overflow-y-auto bg-black shadow-sm border-r border-gray-800 ">
        {routes.map((route) => {
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-gray-300 text-sm font-medium pl-6 transition-all hover:text-white hover:bg-gray-900 h-12 pr-4",
                pathName === route.href
                  ? "text-white bg-gray-800 hover:bg-gray-800 hover:text-white"
                  : ""
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          );
        })}
      </div>
      {/* Footer type sidebar for smaller screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 flex justify-around items-center h-16">
        {routes.map((route) => {
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center text-gray-300 text-xs font-medium transition-all hover:text-white hover:bg-gray-900 h-12 py-1 flex-1",
                pathName === route.href ? "text-white" : ""
              )}
            >
              <route.icon className="h-5 w-5" />
              <span className="mt-1">{route.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
