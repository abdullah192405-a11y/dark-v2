"use client";

import React, { useEffect, useState } from "react";
import { createLogo, updateLogo, getLogos } from "@/actions/site-management";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LogoForm = ({ editingId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    imageUrl: "",
    altText: "Company Logo",
    type: "main",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const logoTypes = [
    { name: "الشعار الرئيسي", value: "main" },
    { name: "الأيقونة المصغرة", value: "favicon" },
    { name: "شعار قائمة التنقل", value: "navbar" },
    { name: "شعار الفوتر", value: "footer" },
  ];

  useEffect(() => {
    if (editingId) {
      loadEditingData();
    }
  }, [editingId]);

  const loadEditingData = async () => {
    const result = await getLogos();
    if (result.success) {
      const logo = result.data.find((l) => l.id === editingId);
      if (logo) {
        setFormData({
          imageUrl: logo.imageUrl,
          altText: logo.altText,
          type: logo.type,
          isActive: logo.isActive,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.imageUrl) {
      setError("يرجى إدخال رابط الصورة");
      setLoading(false);
      return;
    }

    try {
      let result;
      if (editingId) {
        result = await updateLogo(editingId, formData);
      } else {
        result = await createLogo(formData);
      }

      if (result.success) {
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

      <div>
        <Label htmlFor="type">نوع الشعار</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger id="type">
            <SelectValue placeholder="اختر النوع" />
          </SelectTrigger>
          <SelectContent>
            {logoTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="imageUrl">رابط الصورة</Label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/logo.png"
          required
        />
      </div>

      <div>
        <Label htmlFor="altText">النص البديل</Label>
        <Input
          id="altText"
          value={formData.altText}
          onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
          placeholder="وصف الشعار"
        />
      </div>

      {formData.imageUrl && (
        <div className="border-2 border-dashed border-gray-300 rounded p-4">
          <p className="text-sm text-gray-600 mb-2 text-right">معاينة الصورة:</p>
          <img
            src={formData.imageUrl}
            alt={formData.altText}
            className="max-h-48 max-w-full mx-auto object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">مفعل</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : "حفظ"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </form>
  );
};

export default LogoForm;
