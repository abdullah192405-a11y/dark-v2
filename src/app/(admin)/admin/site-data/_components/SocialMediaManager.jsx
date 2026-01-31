"use client";

import React, { useState } from "react";
import {
  createSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
} from "@/actions/site-management";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Trash2, Edit2, Plus, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SocialMediaManager = ({ data, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon: "",
    order: 0,
    isActive: true,
  });

  const platforms = [
    "facebook",
    "instagram",
    "twitter",
    "youtube",
    "tiktok",
    "snapchat",
    "whatsapp",
    "linkedin",
  ];

  const handleEdit = (item) => {
    setFormData({
      platform: item.platform,
      url: item.url,
      icon: item.icon || "",
      order: item.order,
      isActive: item.isActive,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let result;
      if (editingId) {
        result = await updateSocialMediaLink(editingId, formData);
      } else {
        result = await createSocialMediaLink(formData);
      }

      if (result.success) {
        setMessage({ type: "success", text: "تم الحفظ بنجاح" });
        setShowForm(false);
        setEditingId(null);
        setFormData({
          platform: "",
          url: "",
          icon: "",
          order: 0,
          isActive: true,
        });
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

  const handleDelete = async (id) => {
    if (!confirm("هل تريد حذف هذا الرابط؟")) return;

    setLoading(true);
    const result = await deleteSocialMediaLink(id);
    if (result.success) {
      setMessage({ type: "success", text: "تم الحذف بنجاح" });
      onRefresh();
    } else {
      setMessage({ type: "error", text: result.error });
    }
    setLoading(false);
  };

  return (
    <div dir="rtl" className="space-y-4">
      {message && (
        <Alert className={message.type === "success" ? "bg-green-50" : "bg-red-50"}>
          <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>{editingId ? "تعديل الرابط" : "إضافة رابط جديد"}</CardTitle>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              <X size={20} />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>المنصة</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) =>
                      setFormData({ ...formData, platform: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>الرابط</Label>
                  <Input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>الرمز</Label>
                  <Input
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="📱"
                  />
                </div>

                <div>
                  <Label>الترتيب</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label>مفعل</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "جاري الحفظ..." : "حفظ"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={() => setShowForm(!showForm)}
        className="gap-2 float-right"
      >
        <Plus size={18} />
        إضافة جديد
      </Button>

      <div className="clear-both grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item) => (
          <Card key={item.id} className={!item.isActive ? "opacity-50" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-right">
                    {item.platform}
                  </CardTitle>
                  <p className="text-sm text-gray-500 truncate text-right">
                    {item.url}
                  </p>
                </div>
                <span className="text-2xl">{item.icon || "🔗"}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                  className="flex-1"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="text-xs text-center mt-2">
                {item.isActive ? "✓ مفعل" : "✗ معطل"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">لا توجد روابط</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialMediaManager;
