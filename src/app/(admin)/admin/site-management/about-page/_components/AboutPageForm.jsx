"use client";

import React, { useState } from "react";
import { updateAboutPage } from "@/actions/site-management";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const AboutPageForm = ({ aboutPage, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: aboutPage?.title || "عن المتجر",
    content: aboutPage?.content || "",
    heroImage: aboutPage?.heroImage || "",
    isPublished: aboutPage?.isPublished ?? true,
    metaDescription: aboutPage?.metaDescription || "",
    metaKeywords: aboutPage?.metaKeywords || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await updateAboutPage(formData);

      if (result.success) {
        setSuccess(true);
        onSubmit();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("حدث خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">تم الحفظ بنجاح</div>}

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
        <Label htmlFor="content">محتوى الصفحة</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="أدخل محتوى الصفحة هنا"
          rows={10}
          className="font-mono text-sm"
        />
        <p className="text-sm text-gray-500 mt-2">يمكنك استخدام HTML للتنسيق</p>
      </div>

      <div className="p-4 bg-gray-50 rounded space-y-4">
        <h3 className="font-semibold text-right">SEO</h3>

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
          <Label htmlFor="metaKeywords">الكلمات المفتاحية (Meta Keywords)</Label>
          <Input
            id="metaKeywords"
            name="metaKeywords"
            value={formData.metaKeywords}
            onChange={handleChange}
            placeholder="كلمات مفتاحية مفصولة بفاصلة"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 bg-blue-50 rounded">
        <Checkbox
          id="isPublished"
          checked={formData.isPublished}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              isPublished: checked,
            }))
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
  );
};

export default AboutPageForm;
