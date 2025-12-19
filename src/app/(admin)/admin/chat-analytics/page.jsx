import { getChatAnalytics, getChatLogs } from "@/actions/chat-analytics";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, TrendingUp, CheckCircle, XCircle, Calendar } from "lucide-react";
import Image from "next/image";
import { 
  WordCloudChart, 
  SearchTrendsChart, 
  LanguagePieChart, 
  HourlyActivityChart,
  SuccessRateChart,
  DailyTrendsChart
} from "./_components/AnalyticsCharts";

export const metadata = {
  title: "تحليلات الدردشة | لوحة التحكم",
  description: "تحليل بيانات محادثات الذكاء الاصطناعي",
};

export default async function ChatAnalyticsPage() {
  const [analyticsResult, logsResult] = await Promise.all([
    getChatAnalytics(),
    getChatLogs({ page: 1, limit: 10 }),
  ]);

  if (!analyticsResult.success) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          حدث خطأ في تحميل البيانات: {analyticsResult.error}
        </div>
      </div>
    );
  }

  const { summary } = analyticsResult;
  const { logs } = logsResult;

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">تحليلات الدردشة</h1>
        <p className="text-gray-600 mt-2">تحليل وإحصائيات محادثات الذكاء الاصطناعي مع العملاء</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي المحادثات</p>
              <h3 className="text-2xl font-bold mt-1">{summary.totalChats}</h3>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">محادثات بنتائج</p>
              <h3 className="text-2xl font-bold mt-1">{summary.totalWithResults}</h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">بدون نتائج</p>
              <h3 className="text-2xl font-bold mt-1">{summary.totalNoResults}</h3>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">معدل النجاح</p>
              <h3 className="text-2xl font-bold mt-1">{summary.successRate}%</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Language Stats & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LanguagePieChart data={summary.languageStats} />

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">النشاط الأخير</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm text-gray-600">آخر 24 ساعة</span>
              <span className="text-2xl font-bold text-blue-600">{summary.recentChats24h}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              محادثة جديدة في آخر يوم
            </p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SuccessRateChart 
          successRate={summary.successRate} 
          totalChats={summary.totalChats}
          totalWithResults={summary.totalWithResults}
        />
        <HourlyActivityChart data={summary.hourlyActivity} />
      </div>

      <DailyTrendsChart data={summary.dailyTrends} />

      <WordCloudChart data={summary.topSearchTerms} />

      <SearchTrendsChart data={summary.topSearchTerms.slice(0, 10)} />

      {/* Top Viewed Cars */}
      {summary.topCars.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">أكثر السيارات مشاهدة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.topCars.map((car) => (
              <div key={car.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="relative h-32 w-full mb-3">
                  {car.images && car.images[0] ? (
                    <Image
                      src={car.images[0]}
                      alt={`${car.make} ${car.model}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-400">لا توجد صورة</span>
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900">
                  {car.make} {car.model} {car.year}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-blue-600">{car.viewCount}</span> مشاهدة
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Chat Logs */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">أحدث المحادثات</h3>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">سؤال العميل:</p>
                  <p className="text-sm text-gray-700 mt-1">{log.userMessage}</p>
                </div>
                <Badge variant={log.carsShown > 0 ? "default" : "secondary"}>
                  {log.carsShown > 0 ? `${log.carsShown} نتيجة` : "بدون نتائج"}
                </Badge>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="font-medium text-gray-900">رد الذكاء الاصطناعي:</p>
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">{log.aiResponse}</p>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>{new Date(log.createdAt).toLocaleString("ar-SA")}</span>
                <span>اللغة: {log.language === "ar" ? "العربية" : "English"}</span>
                {log.carsFound > 0 && (
                  <span>تم العثور على {log.carsFound} سيارات</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
