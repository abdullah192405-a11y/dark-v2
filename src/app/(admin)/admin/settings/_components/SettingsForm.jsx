"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Shield } from "lucide-react";
import WorkingHoursCard from "./WorkingHoursCard";
import AdminUsersCard from "./AdminUsersCard";

const SettingsForm = () => {
  return (
    <div dir="rtl">
      <Tabs defaultValue="hours">
        <TabsList className="flex-row-reverse justify-end w-full">
          <TabsTrigger value="hours" className="flex flex-row-reverse gap-2">
            <Clock className="h-4 w-4 mr-2" /> ساعات العمل
          </TabsTrigger>

          <TabsTrigger value="admins" className="flex flex-row-reverse gap-2">
            <Shield className="h-4 w-4 mr-2" /> مستخدمو الإدارة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hours" className="space-y-6 mt-6">
          <WorkingHoursCard />
        </TabsContent>

        <TabsContent value="admins" className="space-y-6 mt-6">
          <AdminUsersCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsForm;
