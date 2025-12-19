"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { getReviews, deleteReview } from "@/actions/reviews";
import { toast } from "sonner";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const result = await getReviews(search);
      if (result.success) {
        setReviews(result.data);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    await fetchReviews();
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;

    try {
      const result = await deleteReview(reviewId);
      if (result.success) {
        toast.success("تم حذف التقييم بنجاح");
        fetchReviews();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 flex-1 max-w-md">
          <Input
            placeholder="البحث في التقييمات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Link href="/admin/reviews/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة تقييم جديد
          </Button>
        </Link>
      </div>

      {/* Reviews list */}
      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">لا توجد تقييمات</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{review.clientName}</CardTitle>
                    <p className="text-sm text-gray-500">{review.city}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <Badge variant="secondary">{review.rating}/5</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm text-gray-600">السيارة:</p>
                    <p>{review.car}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-600">التقييم:</p>
                    <p className="text-sm">{review.reviewText}</p>
                  </div>
                  {(review.imageUrl || review.videoUrl) && (
                    <div>
                      <p className="font-medium text-sm text-gray-600">الوسائط:</p>
                      <div className="flex gap-2 mt-1">
                        {review.imageUrl && (
                          <a
                            href={review.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            صورة
                          </a>
                        )}
                        {review.videoUrl && (
                          <a
                            href={review.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            فيديو
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      تم الإنشاء: {new Date(review.createdAt).toLocaleDateString("ar-SA")}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/admin/reviews/edit/${review.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewList;
