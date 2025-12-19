import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h[100vh] px-4 text-center my-32">
      <h1 className="text-6xl font-bold gradient-title mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">الصفحة غير موجودة</h2>
      <p className="text-white-600 mb-4">
        عذراً! الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link href="/">
        <Button>العودة للرئيسية</Button>
      </Link>
    </div>
  );
}