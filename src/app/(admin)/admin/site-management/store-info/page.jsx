"use client";

import React, { useEffect, useState } from "react";
import { getStoreInfo } from "@/actions/site-management";
import StoreInfoForm from "./_components/StoreInfoForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingBar from "@/components/LoadingBar";

const StoreInfoPage = () => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreInfo();
  }, []);

  const fetchStoreInfo = async () => {
    setLoading(true);
    const result = await getStoreInfo();
    if (result.success) {
      setStoreInfo(result.data);
    }
    setLoading(false);
  };

  const handleFormSubmit = () => {
    fetchStoreInfo();
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">معلومات المتجر</h1>
        <p className="text-gray-600 mt-2">إدارة معلومات الموقع والعنوان والبيانات الأساسية</p>
      </div>

      {loading ? (
        <LoadingBar fullScreen={false} className="py-20" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>بيانات المتجر</CardTitle>
            <CardDescription>قم بتحديث معلومات المتجر الأساسية</CardDescription>
          </CardHeader>
          <CardContent>
            <StoreInfoForm storeInfo={storeInfo} onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoreInfoPage;
