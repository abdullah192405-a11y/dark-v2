"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Trash2, Image as ImageIcon, Video, Type } from "lucide-react";

const ArticlesCRUDPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formState, setFormState] = useState({
    id: null,
    title: "",
    slug: "",
    contentSections: [],
    excerpt: "",
    published: false,
    image: "",
    tags: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [contentImageFiles, setContentImageFiles] = useState({});
  const [contentVideoFiles, setContentVideoFiles] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/article");
      const json = await res.json();
      if (json.success) {
        setArticles(json.data);
      } else {
        toast.error(json.error || "Failed to fetch articles");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch articles");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormState((prev) => ({ ...prev, tags }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentImageChange = (sectionId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContentImageFiles(prev => ({
          ...prev,
          [sectionId]: reader.result
        }));
        updateContentSection(sectionId, 'src', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentVideoChange = (sectionId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContentVideoFiles(prev => ({
          ...prev,
          [sectionId]: reader.result
        }));
        updateContentSection(sectionId, 'src', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const addContentSection = (type) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      content: type === 'paragraph' ? '' : undefined,
      src: type === 'image' || type === 'video' ? '' : undefined,
      alt: type === 'image' || type === 'video' ? '' : undefined,
    };
    setFormState(prev => ({
      ...prev,
      contentSections: [...prev.contentSections, newSection]
    }));
  };

  const updateContentSection = (id, field, value) => {
    setFormState(prev => ({
      ...prev,
      contentSections: prev.contentSections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    }));
  };

  const removeContentSection = (id) => {
    setFormState(prev => ({
      ...prev,
      contentSections: prev.contentSections.filter(section => section.id !== id)
    }));
  };

  const moveContentSection = (index, direction) => {
    const newSections = [...formState.contentSections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newSections.length) {
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
      setFormState(prev => ({ ...prev, contentSections: newSections }));
    }
  };

  const openNewDialog = () => {
    setFormState({
      id: null,
      title: "",
      slug: "",
      contentSections: [],
      excerpt: "",
      published: false,
      image: "",
      tags: [],
    });
    setImageFile(null);
    setImagePreview("");
    setContentImageFiles({});
    setContentVideoFiles({});
    setIsEditMode(false);
    setDialogOpen(true);
  };

  const openEditDialog = (article) => {
    // Parse contentSections from content if it's stored as JSON
    let contentSections = [];
    if (article.content) {
      try {
        const parsed = JSON.parse(article.content);
        if (Array.isArray(parsed)) {
          contentSections = parsed;
        }
      } catch (e) {
        // If parsing fails, treat content as plain text and create a paragraph section
        contentSections = [{ id: Date.now().toString(), type: 'paragraph', content: article.content }];
      }
    }

    // Populate contentImageFiles and contentVideoFiles with existing media
    const initialContentImageFiles = {};
    const initialContentVideoFiles = {};
    contentSections.forEach(section => {
      if (section.type === 'image' && section.src) {
        initialContentImageFiles[section.id] = section.src;
      } else if (section.type === 'video' && section.src) {
        initialContentVideoFiles[section.id] = section.src;
      }
    });

    setFormState({
      id: article.id,
      title: article.title,
      slug: article.slug,
      contentSections: contentSections,
      excerpt: article.excerpt || "",
      published: article.published,
      image: article.image || "",
      tags: article.tags || [],
    });
    setImageFile(null);
    setImagePreview(article.image || "");
    setContentImageFiles(initialContentImageFiles);
    setIsEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف المقال؟")) return;

    try {
      const res = await fetch("/api/article", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("تم حذف المقال بنجاح!");
        fetchArticles();
      } else {
        toast.error(json.error || "فشل حذف المقال");
      }
    } catch (error) {
      toast.error(error.message || "فشل حذف المقال");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, title, slug, contentSections, excerpt, published, tags } = formState;

    if (!title || !slug || contentSections.length === 0) {
      toast.error("الرجاء ملء كافة الحقول المطلوبة");
      return;
    }

    let imageUrl = formState.image;

    // If there's a new image file, convert it to base64
    if (imageFile) {
      imageUrl = imagePreview;
    }

    const method = isEditMode ? "PUT" : "POST";
    const body = isEditMode
      ? JSON.stringify({ id, title, slug, contentSections, excerpt, published, image: imageUrl, tags })
      : JSON.stringify({ title, slug, contentSections, excerpt, published, image: imageUrl, tags });

    try {
      const res = await fetch("/api/article", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      const json = await res.json();
      if (json.success) {
        toast.success(
          isEditMode ? "تم تحديث المقال بنجاح!" : "تم إضافة المقال بنجاح!"
        );
        setDialogOpen(false);
        fetchArticles();
      } else {
        toast.error(json.error || "فشل الحفظ");
      }
    } catch (error) {
      toast.error(error.message || "فشل الحفظ");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة المقالات</h1>
        <Button onClick={openNewDialog} size="lg">
          + إضافة مقال جديد
        </Button>
      </div>

      <div className="bg-black rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-center">العنوان</TableHead>
              <TableHead className="font-semibold text-center">الحالة</TableHead>
              <TableHead className="font-semibold text-center">الكاتب</TableHead>
              <TableHead className="font-semibold text-center">تاريخ النشر</TableHead>
              <TableHead className="font-semibold text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  لا توجد مقالات للعرض
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id} className="hover:bg-black-50">
                  <TableCell className="text-center font-medium">{article.title}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      article.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.published ? 'منشور' : 'مسودة'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{article.author?.name || 'غير محدد'}</TableCell>
                  <TableCell className="text-center">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ar-SA') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(article)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-black text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditMode ? "تعديل المقال" : "إضافة مقال جديد"}
            </DialogTitle>
            <DialogDescription>
              الرجاء ملء المعلومات أدناه لإضافة أو تحديث بيانات المقال.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                عنوان المقال <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formState.title}
                onChange={(e) => {
                  handleInputChange(e);
                  if (!isEditMode) {
                    setFormState(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                  }
                }}
                placeholder="أدخل عنوان المقال"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug" className="text-sm font-medium">
                الرابط المختصر (Slug) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                name="slug"
                value={formState.slug}
                onChange={handleInputChange}
                placeholder="رابط-المقال"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt" className="text-sm font-medium">
                ملخص المقال
              </Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formState.excerpt}
                onChange={handleInputChange}
                placeholder="أدخل ملخص مختصر للمقال"
                className="mt-1.5"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                محتوى المقال <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1.5 space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addContentSection('paragraph')}
                  >
                    <Type className="w-4 h-4 mr-2" />
                    إضافة فقرة
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addContentSection('image')}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    إضافة صورة
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addContentSection('video')}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    إضافة فيديو
                  </Button>
                </div>

                <div className="space-y-3">
                  {formState.contentSections.map((section, index) => (
                    <div key={section.id} className="border rounded-lg p-4 bg-black-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {section.type === 'paragraph' && 'فقرة'}
                            {section.type === 'image' && 'صورة'}
                            {section.type === 'video' && 'فيديو'}
                          </span>
                          <span className="text-xs text-gray-500">#{index + 1}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveContentSection(index, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveContentSection(index, 'down')}
                            disabled={index === formState.contentSections.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeContentSection(section.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {section.type === 'paragraph' && (
                        <Textarea
                          value={section.content || ''}
                          onChange={(e) => updateContentSection(section.id, 'content', e.target.value)}
                          placeholder="أدخل نص الفقرة"
                          rows={4}
                        />
                      )}

                      {section.type === 'image' && (
                        <div className="space-y-3">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleContentImageChange(section.id, e)}
                            placeholder="اختر صورة"
                          />
                          {contentImageFiles[section.id] && (
                            <div className="mt-3 flex justify-center">
                              <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-black-50">
                                <img
                                  src={contentImageFiles[section.id]}
                                  alt="Preview"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          )}
                          <Input
                            value={section.alt || ''}
                            onChange={(e) => updateContentSection(section.id, 'alt', e.target.value)}
                            placeholder="وصف البديل"
                          />
                        </div>
                      )}

                      {section.type === 'video' && (
                        <div className="space-y-3">
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleContentVideoChange(section.id, e)}
                            placeholder="اختر فيديو"
                          />
                          {contentVideoFiles[section.id] && (
                            <div className="mt-3 flex justify-center">
                              <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-black-50">
                                <video
                                  src={contentVideoFiles[section.id]}
                                  controls
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          )}
                          <Input
                            value={section.alt || ''}
                            onChange={(e) => updateContentSection(section.id, 'alt', e.target.value)}
                            placeholder="وصف البديل"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {formState.contentSections.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    لا توجد أقسام محتوى. أضف فقرة أو صورة أو فيديو لبدء إنشاء المقال.
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="tags" className="text-sm font-medium">
                الكلمات المفتاحية (مفصولة بفواصل)
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formState.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="سيارات, صيانة, نصائح"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="image" className="text-sm font-medium">
                صورة المقال
              </Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1.5"
              />
              {imagePreview && (
                <div className="mt-3 flex justify-center">
                  <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-black-50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1.5">
                يمكنك رفع صورة بصيغة PNG أو JPG
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                name="published"
                checked={formState.published}
                onCheckedChange={(checked) => setFormState(prev => ({ ...prev, published: checked }))}
              />
              <Label htmlFor="published" className="text-sm font-medium">
                نشر المقال
              </Label>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="button" onClick={handleSubmit}>
                {isEditMode ? "تحديث المقال" : "إضافة المقال"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArticlesCRUDPage;
