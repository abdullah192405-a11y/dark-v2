"use client";

import React, { useEffect, useState } from "react";
import {
  createSocialMediaLink,
  updateSocialMediaLink,
  getSocialMediaLinks,
} from "@/actions/site-management";
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

const SocialMediaForm = ({ editingId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon: "",
    order: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const platforms = [
    { name: "Facebook", value: "facebook" },
    { name: "Instagram", value: "instagram" },
    { name: "Twitter", value: "twitter" },
    { name: "YouTube", value: "youtube" },
    { name: "TikTok", value: "tiktok" },
    { name: "Snapchat", value: "snapchat" },
    { name: "WhatsApp", value: "whatsapp" },
    { name: "LinkedIn", value: "linkedin" },
    { name: "Pinterest", value: "pinterest" },
  ];

  useEffect(() => {
    if (editingId) {
      loadEditingData();
    }
  }, [editingId]);

  const loadEditingData = async () => {
    const result = await getSocialMediaLinks();
    if (result.success) {
      const link = result.data.find((l) => l.id === editingId);
      if (link) {
        setFormData({
          platform: link.platform,
          url: link.url,
          icon: link.icon || "",
          order: link.order,
          isActive: link.isActive,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.platform || !formData.url) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      setLoading(false);
      return;
    }

    try {
      let result;
      if (editingId) {
        result = await updateSocialMediaLink(editingId, formData);
      } else {
        result = await createSocialMediaLink(formData);
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
        <Label htmlFor="platform">المنصة</Label>
        <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
          <SelectTrigger id="platform">
            <SelectValue placeholder="اختر المنصة" />
          </SelectTrigger>
          <SelectContent>
            {platforms.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="url">الرابط</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://example.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="icon">الرمز (اختياري)</Label>
        <Input
          id="icon"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="📱 أو اسم الأيقونة"
        />
      </div>

      <div>
        <Label htmlFor="order">ترتيب العرض</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
        />
      </div>

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

export default SocialMediaForm;
