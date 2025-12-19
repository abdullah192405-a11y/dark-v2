import React from "react";
import SettingsForm from "./_components/SettingsForm";

export const metadata = {
  title: "الإعدادات | Click Car Admin",
  description: "إدارة ساعات العمل ومستخدمي الإدارة",
};

const SettingsPage = () => {
  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-right">الإعدادات</h1>
      <SettingsForm />
    </div>
  );
};

export default SettingsPage;
