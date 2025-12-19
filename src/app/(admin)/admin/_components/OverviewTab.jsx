"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Car, DollarSign, Info, TrendingUp } from "lucide-react";

const OverviewTab = ({ cars, testDrives }) => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row-reverse items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي السيارات</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-right">
            <div className="text-2xl font-bold">{cars.total}</div>
            <p className="text-xs text-muted-foreground">
              {cars.available} متاحة، {cars.sold} مباعة
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row-reverse items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">اختبارات القيادة</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-right">
            <div className="text-2xl font-bold">{testDrives.total}</div>
            <p className="text-xs text-muted-foreground">
              {testDrives.pending} قيد الانتظار، {testDrives.confirmed} مؤكدة
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row-reverse items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              معدل التحويل
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-right">
            <div className="text-2xl font-bold">
              {testDrives.conversionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              من اختبارات القيادة إلى المبيعات
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row-reverse items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">السيارات المباعة</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-right">
            <div className="text-2xl font-bold">{cars.sold}</div>
            <p className="text-xs text-muted-foreground">
              {((cars.sold / cars.total) * 100).toFixed(1)}% من المخزون
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Overview Content */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-right">ملخص المعرض</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Car inventory */}
              <div className="bg-black-50 p-4 rounded-lg">
                <h3 className="font-medium text-sm mb-2 text-right">مخزون السيارات</h3>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">
                    {((cars.available / cars.total) * 100).toFixed(0)}%
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5" style={{ transform: 'scaleX(-1)' }}>
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${(cars.available / cars.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right">
                  سعة المخزون المتاحة
                </p>
              </div>

              {/* test drive success */}
              <div className="bg-black-50 p-4 rounded-lg">
                <h3 className="font-medium text-sm mb-2 text-right">نجاح اختبار القيادة</h3>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">
                    {(
                      (testDrives.completed / (testDrives.total || 1)) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5" style={{ transform: 'scaleX(-1)' }}>
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (testDrives.completed / (testDrives.total || 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right">
                  اختبارات القيادة المكتملة
                </p>
              </div>
            </div>

            {/* summary */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center flex flex-col items-center">
                <span className="text-3xl font-bold text-blue-600">
                  {cars.sold}
                </span>
                <p className="text-sm text-gray-600 mt-1">السيارات المباعة</p>
              </div>
              <div className="text-center flex flex-col items-center">
                <span className="text-3xl font-bold text-amber-600">
                  {testDrives.pending + testDrives.confirmed}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  اختبارات القيادة القادمة
                </p>
              </div>
              <div className="text-center flex flex-col items-center">
                <span className="text-3xl font-bold text-green-600">
                  {((cars.available / (cars.total || 1)) * 100).toFixed(0)}%
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  استخدام المخزون
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OverviewTab;
