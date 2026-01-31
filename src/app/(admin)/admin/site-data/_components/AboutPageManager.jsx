"use client";

import React, { useState } from "react";
import { updateAboutPage } from "@/actions/site-management";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AboutPageManager = ({ data, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: data?.title || "عن المتجر",
    content: data?.content || "",
    heroImage: data?.heroImage || "",
    isPublished: data?.isPublished ?? true,
    metaDescription: data?.metaDescription || "",
    metaKeywords: data?.metaKeywords || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await updateAboutPage(formData);
      if (result.success) {
        setMessage({ type: "success", text: "تم الحفظ بنجاح" });
        onRefresh();
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="space-y-4">
      {message && (
        <Alert className={message.type === "success" ? "bg-green-50" : "bg-red-50"}>
          <AlertDescription
            className={
              message.type === "success" ? "text-green-800" : "text-red-800"
            }
          >
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-right">محتوى صفحة عن المتجر</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">عنوان الصفحة</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="heroImage">رابط صورة الرأس (اختياري)</Label>
              <Input
                id="heroImage"
                name="heroImage"
                type="url"
                value={formData.heroImage}
                onChange={handleChange}
                placeholder="https://example.com/hero.jpg"
              />
            </div>

            {formData.heroImage && (
              <div className="border-2 border-dashed border-gray-300 rounded p-4">
                <p className="text-sm text-gray-600 mb-2 text-right">معاينة الصورة:</p>
                <img
                  src={formData.heroImage}
                  alt="صورة الرأس"
                  className="max-h-48 max-w-full mx-auto object-contain rounded"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <div>
              <Label htmlFor="content">محتوى الصفحة (HTML)</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="أدخل محتوى الصفحة هنا"
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                يمكنك استخدام HTML للتنسيق
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded space-y-4">
              <h3 className="font-semibold text-right">تحسين محركات البحث (SEO)</h3>

              <div>
                <Label htmlFor="metaDescription">وصف الصفحة (Meta Description)</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="وصف قصير للصفحة (150 حرف تقريباً)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="metaKeywords">الكلمات المفتاحية</Label>
                <Input
                  id="metaKeywords"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleChange}
                  placeholder="كلمات مفصولة بفاصلة"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded flex items-center gap-3">
              <Checkbox
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("isPublished", checked)
                }
              />
              <Label htmlFor="isPublished" className="cursor-pointer">
                نشر الصفحة (عرض للزوار)
              </Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPageManager;
