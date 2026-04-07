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
import { toast } from "sonner";
import LoadingBar from "@/components/LoadingBar";

const BankCRUDPage = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formState, setFormState] = useState({
    id: null,
    name: "",
    logoImage: "",
    interestRate: "",
    loanPolicy: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bank");
      const json = await res.json();
      if (json.success) {
        setBanks(json.data);
      } else {
        toast.error(json.error || "Failed to fetch banks");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch banks");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleInputChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const openNewDialog = () => {
    setFormState({
      id: null,
      name: "",
      logoImage: "",
      interestRate: "",
      loanPolicy: "",
    });
    setImageFile(null);
    setImagePreview("");
    setIsEditMode(false);
    setDialogOpen(true);
  };

  const openEditDialog = (bank) => {
    setFormState({
      id: bank.id,
      name: bank.name,
      logoImage: bank.logoImage,
      interestRate: bank.interestRate.toString(),
      loanPolicy: bank.loanPolicy || "",
    });
    setImageFile(null);
    setImagePreview(bank.logoImage);
    setIsEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف البنك؟")) return;

    try {
      const res = await fetch("/api/bank", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("تم حذف البنك بنجاح!");
        fetchBanks();
      } else {
        toast.error(json.error || "فشل حذف البنك");
      }
    } catch (error) {
      toast.error(error.message || "فشل حذف البنك");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, interestRate, loanPolicy } = formState;

    if (!name || interestRate === "") {
      toast.error("الرجاء ملء كافة الحقول المطلوبة");
      return;
    }

    if (!imageFile && !imagePreview) {
      toast.error("الرجاء إضافة شعار البنك");
      return;
    }

    let logoImageUrl = formState.logoImage;

    // If there's a new image file, convert it to base64
    if (imageFile) {
      logoImageUrl = imagePreview;
    }

    const method = isEditMode ? "PUT" : "POST";
    const body = isEditMode
      ? JSON.stringify({ id, name, logoImage: logoImageUrl, interestRate: parseFloat(interestRate), loanPolicy })
      : JSON.stringify({ name, logoImage: logoImageUrl, interestRate: parseFloat(interestRate), loanPolicy });

    try {
      const res = await fetch("/api/bank", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      const json = await res.json();
      if (json.success) {
        toast.success(
          isEditMode ? "تم تحديث البنك بنجاح!" : "تم إضافة البنك بنجاح!"
        );
        setDialogOpen(false);
        fetchBanks();
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
        <h1 className="text-3xl font-bold">إدارة البنوك</h1>
        <Button onClick={openNewDialog} size="lg">
          + إضافة بنك جديد
        </Button>
      </div>

      <div className="bg-black rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-center">الشعار</TableHead>
              <TableHead className="font-semibold text-center">الاسم</TableHead>
              <TableHead className="font-semibold text-center">سعر الفائدة</TableHead>
              <TableHead className="font-semibold text-center">سياسة القرض</TableHead>
              <TableHead className="font-semibold text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <LoadingBar fullScreen={false} />
                </TableCell>
              </TableRow>
            ) : banks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  لا توجد بنوك للعرض
                </TableCell>
              </TableRow>
            ) : (
              banks.map((bank) => (
                <TableRow key={bank.id} className="hover:bg-black-50">
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <img
                        src={bank.logoImage}
                        alt={bank.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{bank.name}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {typeof bank.interestRate === 'number' ? bank.interestRate.toFixed(2) : parseFloat(bank.interestRate).toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {bank.loanPolicy
                      ? bank.loanPolicy.length > 50
                        ? bank.loanPolicy.substring(0, 50) + "..."
                        : bank.loanPolicy
                      : "غير محدد"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(bank)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(bank.id)}
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
        <DialogContent className="bg-black text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditMode ? "تعديل البنك" : "إضافة بنك جديد"}
            </DialogTitle>
            <DialogDescription>
              الرجاء ملء المعلومات أدناه لإضافة أو تحديث بيانات البنك.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                اسم البنك <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                placeholder="أدخل اسم البنك"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="logoImage" className="text-sm font-medium">
                شعار البنك <span className="text-red-500">*</span>
              </Label>
              <Input
                id="logoImage"
                name="logoImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1.5"
              />
              {imagePreview && (
                <div className="mt-3 flex justify-center">
                  <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
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

            <div>
              <Label htmlFor="interestRate" className="text-sm font-medium">
                سعر الفائدة (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="interestRate"
                name="interestRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formState.interestRate}
                onChange={handleInputChange}
                placeholder="مثال: 5.50"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="loanPolicy" className="text-sm font-medium">
                سياسة القرض
              </Label>
              <Textarea
                id="loanPolicy"
                name="loanPolicy"
                value={formState.loanPolicy}
                onChange={handleInputChange}
                placeholder="أدخل سياسة القرض"
                className="mt-1.5"
                rows={4}
              />
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
                {isEditMode ? "تحديث البنك" : "إضافة البنك"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankCRUDPage;