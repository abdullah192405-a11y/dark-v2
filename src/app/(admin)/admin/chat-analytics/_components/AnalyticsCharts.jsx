"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { useMemo } from "react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function WordCloudChart({ data }) {
  const topWords = useMemo(() => data.slice(0, 20), [data]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">سحابة الكلمات المستخدمة في البحث</h3>
      <div className="flex flex-wrap gap-2 justify-center items-center min-h-[300px]">
        {topWords.map((word, index) => {
          const fontSize = Math.max(12, Math.min(40, 12 + (word.count * 2)));
          const opacity = Math.max(0.5, Math.min(1, 0.5 + (word.count / topWords[0].count) * 0.5));
          return (
            <span
              key={index}
              className="inline-block px-2 py-1 rounded hover:scale-110 transition-transform cursor-pointer"
              style={{
                fontSize: `${fontSize}px`,
                opacity: opacity,
                color: COLORS[index % COLORS.length],
                fontWeight: word.count > topWords[0].count / 2 ? 'bold' : 'normal',
              }}
              title={`${word.count} مرة`}
            >
              {word.term}
            </span>
          );
        })}
      </div>
    </Card>
  );
}

export function SearchTrendsChart({ data }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">أكثر الكلمات بحثاً</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="term" width={100} />
          <Tooltip 
            content={({ payload }) => {
              if (payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">{payload[0].payload.term}</p>
                    <p className="text-sm text-gray-600">{payload[0].value} مرة</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function LanguagePieChart({ data }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">توزيع اللغات</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ language, percentage }) => `${language} ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            content={({ payload }) => {
              if (payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">{payload[0].payload.language}</p>
                    <p className="text-sm text-gray-600">{payload[0].value} محادثة</p>
                    <p className="text-sm text-gray-600">{payload[0].payload.percentage}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function HourlyActivityChart({ data }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">نشاط المحادثات حسب الساعة</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" label={{ value: 'الساعة', position: 'insideBottom', offset: -5 }} />
          <YAxis />
          <Tooltip 
            content={({ payload }) => {
              if (payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">الساعة {payload[0].payload.hour}</p>
                    <p className="text-sm text-gray-600">{payload[0].value} محادثة</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorChats)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function SuccessRateChart({ successRate, totalChats, totalWithResults }) {
  const data = [
    { name: 'بنتائج', value: totalWithResults, color: '#10b981' },
    { name: 'بدون نتائج', value: totalChats - totalWithResults, color: '#ef4444' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">معدل نجاح البحث</h3>
      <div className="flex items-center justify-center gap-8">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{successRate}%</p>
            <p className="text-sm text-gray-600">معدل النجاح</p>
          </div>
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function DailyTrendsChart({ data }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">الاتجاه اليومي للمحادثات</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            content={({ payload }) => {
              if (payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">{payload[0].payload.date}</p>
                    <p className="text-sm text-gray-600">{payload[0].value} محادثة</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
