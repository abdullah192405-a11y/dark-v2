import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock } from "lucide-react";

const TestDriveTab = ({ testDrives }) => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Total */}
        <Card>
          <CardHeader className="flex flex-row-reverse items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي اختبارات القيادة
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-right">
            <div className="text-2xl font-bold">{testDrives.total}</div>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card>
          <CardHeader className="flex flex-row-reverse items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد الانتظار</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="text-right">
            <div className="text-2xl font-bold">{testDrives.pending}</div>
            <p className="text-xs text-muted-foreground">
              {((testDrives.pending / testDrives.total) * 100).toFixed(1)}% من الحجوزات
            </p>
          </CardContent>
        </Card>

        {/* Confirmed */}
        <Card>
          <CardHeader className="flex flex-row-reverse items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مؤكدة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="text-right">
            <div className="text-2xl font-bold">{testDrives.confirmed}</div>
            <p className="text-xs text-muted-foreground">
              {((testDrives.confirmed / testDrives.total) * 100).toFixed(1)}% من الحجوزات
            </p>
          </CardContent>
        </Card>

        {/*  completed*/}
        <Card>
          <CardHeader className="flex flex-row-reverse items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="text-right">
            <div className="text-2xl font-bold">{testDrives.completed}</div>
            <p className="text-xs text-muted-foreground">
              {((testDrives.completed / testDrives.total) * 100).toFixed(1)}% من الحجوزات
            </p>
          </CardContent>
        </Card>

        {/* cancelled */}
        <Card>
          <CardHeader className="flex flex-row-reverse items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ملغاة</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="text-right">
            <div className="text-2xl font-bold">{testDrives.cancelled}</div>
            <p className="text-xs text-muted-foreground">
              {((testDrives.cancelled / testDrives.total) * 100).toFixed(1)}% من الحجوزات
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Drive Statistics */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-right">إحصائيات اختبار القيادة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black-50 p-4 rounded-lg text-right">
              <h3 className="font-medium text-sm mb-2">معدل التحويل</h3>
              <span className="text-3xl font-bold text-blue-600">
                {testDrives.conversionRate} %
              </span>
              <p className="text-sm text-gray-600 mt-1">
                اختبارات القيادة التي أدت إلى شراء السيارات
              </p>
            </div>

            <div className="bg-black-50 p-4 rounded-lg text-right">
              <h3 className="font-medium text-sm mb-2">معدل الإكمال</h3>
              <span className="text-3xl font-bold text-green-600">
                {(testDrives.completed / testDrives.total) * 100} %
              </span>
              <p className="text-sm text-gray-600 mt-1">
                اختبارات القيادة المكتملة بنجاح
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking status breakdown*/}
      <div className="mt-4 bg-black-50 p-4 rounded-lg space-y-4">
        <h3 className="font-medium text-sm mb-2 text-right"> تفصيل حالة الحجز</h3>
        {/* pending */}
        <div>
          <div className="flex items-center">
            <span className="mr-2 text-sm pr-2">
              {((testDrives.pending / testDrives.total) * 100).toFixed(0)}%
            </span>
            <div className="w-96/100 bg-gray-200 rounded-full h-2.5" style={{ transform: 'scaleX(-1)' }}>
              <div
                className="bg-amber-600 h-2.5 rounded-full"
                style={{
                  width: `${(testDrives.pending / testDrives.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">اختبارات القيادة قيد الانتظار</p>
        </div>
        {/* confirmed */}
        <div>
          <div className="flex items-center">
            <span className="mr-2 text-sm pr-2">
              {((testDrives.confirmed / testDrives.total) * 100).toFixed(0)}%
            </span>
            <div className="w-96/100 bg-gray-200 rounded-full h-2.5" style={{ transform: 'scaleX(-1)' }}>
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{
                  width: `${(testDrives.confirmed / testDrives.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">اختبارات القيادة المؤكدة</p>
        </div>
        {/* completed */}
        <div>
          <div className="flex items-center">
            <span className="mr-2 text-sm pr-2">
              {((testDrives.completed / testDrives.total) * 100).toFixed(0)}%
            </span>
            <div className="w-96/100 bg-gray-200 rounded-full h-2.5" style={{ transform: 'scaleX(-1)' }}>
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${(testDrives.completed / testDrives.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">اختبارات القيادة المكتملة</p>
        </div>
        {/* Cancelled */}
        <div>
          <div className="flex items-center">
            <span className="mr-2 text-sm pr-2">
              {((testDrives.cancelled / testDrives.total) * 100).toFixed(0)}%
            </span>
            <div className="w-96/100 bg-gray-200 rounded-full h-2.5" style={{ transform: 'scaleX(-1)' }}>
              <div
                className="bg-red-600 h-2.5 rounded-full"
                style={{
                  width: `${(testDrives.cancelled / testDrives.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">اختبارات القيادة الملغاة</p>
        </div>
        {/* no show */}
        <div>
          <div className="flex items-center">
            <span className="mr-2 text-sm pr-2">
              {((testDrives.noShow / testDrives.total) * 100).toFixed(0)}%
            </span>
            <div className="w-96/100 bg-gray-200 rounded-full h-2.5" style={{ transform: 'scaleX(-1)' }}>
              <div
                className="bg-gray-600 h-2.5 rounded-full"
                style={{
                  width: `${(testDrives.noShow / testDrives.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">اختبارات القيادة بدون حضور</p>
        </div>
      </div>
    </>
  );
};

export default TestDriveTab;
