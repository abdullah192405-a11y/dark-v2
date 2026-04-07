"use client";

import React, { useEffect, useState } from "react";
import { getLogos, deleteLogo } from "@/actions/site-management";
import LogoForm from "./_components/LogoForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Plus } from "lucide-react";
import Image from "next/image";
import LoadingBar from "@/components/LoadingBar";

const LogoPage = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    setLoading(true);
    const result = await getLogos();
    if (result.success) {
      setLogos(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الشعار؟")) return;

    const result = await deleteLogo(id);
    if (result.success) {
      setLogos(logos.filter((logo) => logo.id !== id));
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingId(null);
    fetchLogos();
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الشعار (اللوجو)</h1>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="gap-2"
        >
          <Plus size={18} />
          إضافة شعار جديد
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "تعديل الشعار" : "إضافة شعار جديد"}</CardTitle>
            </CardHeader>
            <CardContent>
              <LogoForm
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
        <LoadingBar fullScreen={false} className="py-12" />
      ) : logos.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">لا توجد شعارات حالياً</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {logos.map((logo) => (
            <Card key={logo.id} className={!logo.isActive ? "opacity-50" : "border-2 border-blue-500"}>
              <CardHeader>
                <CardTitle className="text-lg text-right">{logo.type}</CardTitle>
                <CardDescription className="text-right">{logo.altText}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                  {logo.imageUrl && (
                    <Image
                      src={logo.imageUrl}
                      alt={logo.altText}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="text-sm text-gray-500 text-center">
                  {logo.isActive ? "✓ مفعل" : "✗ معطل"}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(logo.id);
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
                    onClick={() => handleDelete(logo.id)}
                    className="flex-1 gap-1"
                  >
                    <Trash2 size={16} />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogoPage;
