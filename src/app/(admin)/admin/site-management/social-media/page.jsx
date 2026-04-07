"use client";

import React, { useEffect, useState } from "react";
import { getSocialMediaLinks, deleteSocialMediaLink } from "@/actions/site-management";
import SocialMediaForm from "./_components/SocialMediaForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Plus } from "lucide-react";
import Link from "next/link";

import LoadingBar from "@/components/LoadingBar";

const SocialMediaPage = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    setLoading(true);
    const result = await getSocialMediaLinks();
    if (result.success) {
      setSocialLinks(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الرابط؟")) return;

    const result = await deleteSocialMediaLink(id);
    if (result.success) {
      setSocialLinks(socialLinks.filter((link) => link.id !== id));
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingId(null);
    fetchSocialLinks();
  };

  const platforms = [
    { name: "Facebook", icon: "f" },
    { name: "Instagram", icon: "📸" },
    { name: "Twitter", icon: "𝕏" },
    { name: "YouTube", icon: "▶️" },
    { name: "TikTok", icon: "♪" },
    { name: "Snapchat", icon: "👻" },
    { name: "WhatsApp", icon: "💬" },
  ];

  return (
    <div className="p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">وسائل التواصل الاجتماعي</h1>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="gap-2"
        >
          <Plus size={18} />
          إضافة رابط جديد
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "تعديل الرابط" : "إضافة رابط جديد"}</CardTitle>
            </CardHeader>
            <CardContent>
              <SocialMediaForm
                editingId={editingId}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {loading ? (
        <LoadingBar fullScreen={false} className="py-20" />
      ) : socialLinks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">لا توجد روابط حالياً</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialLinks.map((link) => (
            <Card key={link.id} className={!link.isActive ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{link.platform}</CardTitle>
                    <CardDescription className="truncate">{link.url}</CardDescription>
                  </div>
                  <div className="text-2xl">{link.icon || "🔗"}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(link.id);
                      setShowForm(true);
                    }}
                    className="flex-1 gap-1"
                  >
                    <Edit2 size={16} />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                    className="flex-1 gap-1"
                  >
                    <Trash2 size={16} />
                    حذف
                  </Button>
                </div>
                <div className="mt-2 text-sm text-gray-500 text-center">
                  {link.isActive ? "✓ مفعل" : "✗ معطل"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialMediaPage;
