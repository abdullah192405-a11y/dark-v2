"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { getReviewForEdit, updateReview } from "@/actions/reviews";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const EditReviewForm = ({ reviewId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    clientName: "",
    city: "",
    car: "",
    rating: "",
    videoFile: null,
    imageFile: null,
    reviewText: "",
  });

  useEffect(() => {
    fetchReview();
  }, [reviewId]);

  const fetchReview = async () => {
    try {
      const result = await getReviewForEdit(reviewId);
      if (result.success) {
        setFormData({
          clientName: result.data.clientName,
          city: result.data.city,
          car: result.data.car,
          rating: result.data.rating.toString(),
          videoFile: null, // Keep existing files, only replace if new file uploaded
          imageFile: null,
          reviewText: result.data.reviewText,
        });
      } else {
        toast.error(result.error);
        router.push("/admin/reviews");
      }
    } catch (error) {
      toast.error("Failed to fetch review");
      router.push("/admin/reviews");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clientName || !formData.city || !formData.car || !formData.rating || !formData.reviewText) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const result = await updateReview(reviewId, {
        ...formData,
        rating: parseInt(formData.rating),
      });

      if (result.success) {
        toast.success("تم تحديث التقييم بنجاح");
        router.push("/admin/reviews");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث التقييم");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 cursor-pointer ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
        onClick={() => handleInputChange("rating", (i + 1).toString())}
      />
    ));
  };

  if (fetchLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/reviews">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة إلى قائمة التقييمات
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تعديل التقييم</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName" className="mb-2">اسم العميل *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  placeholder="أدخل اسم العميل"
                  required
                />
              </div>
              <div>
                <Label htmlFor="city" className="mb-2">المدينة *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="أدخل المدينة"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="car" className="mb-2">السيارة *</Label>
              <Input
                id="car"
                value={formData.car}
                onChange={(e) => handleInputChange("car", e.target.value)}
                placeholder="أدخل اسم السيارة"
                required
              />
            </div>

            <div>
              <Label className="mb-2">التقييم *</Label>
              <div className="flex gap-1 mt-2">
                {renderStars(parseInt(formData.rating) || 0)}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.rating ? `${formData.rating}/5` : "اختر التقييم"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="videoFile" className="mb-2">ملف الفيديو الجديد (اختياري)</Label>
                <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleInputChange("videoFile", e.target.files[0])}
                />
                <p className="text-xs text-gray-500 mt-1">سيحل محل الفيديو الحالي إذا تم تحميل ملف جديد</p>
              </div>
              <div>
                <Label htmlFor="imageFile" className="mb-2">ملف الصورة الجديد (اختياري)</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleInputChange("imageFile", e.target.files[0])}
                />
                <p className="text-xs text-gray-500 mt-1">سيحل محل الصورة الحالية إذا تم تحميل ملف جديد</p>
              </div>
            </div>

            <div>
              <Label htmlFor="reviewText" className="mb-2">نص التقييم *</Label>
              <Textarea
                id="reviewText"
                value={formData.reviewText}
                onChange={(e) => handleInputChange("reviewText", e.target.value)}
                placeholder="أدخل نص التقييم"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "جاري التحديث..." : "تحديث التقييم"}
              </Button>
              <Link href="/admin/reviews">
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditReviewForm;
