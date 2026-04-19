"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CarIcon,
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { React, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useFetch from "../../../../../../hooks/use-fetch";
import { deleteCars, getCars, updateCarStatus } from "@/actions/cars";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { formatSaudiRiyalReact } from "@/lib/helper";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CarList = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [carToDelete, setCarToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // getCars
  const {
    loading: getCarsLoading,
    fn: getCarFn,
    data: getCarsData,
    error: getCarsError,
  } = useFetch(getCars);

  // update car
  const {
    loading: updateCarLoading,
    fn: updateCarFn,
    data: updatedCarData,
    error: updatedCarsError,
  } = useFetch(updateCarStatus);

  // delete cars
  const {
    loading: deleteCarLoading,
    fn: deleteCarFn,
    data: deletedCarData,
    error: deleteCarError,
  } = useFetch(deleteCars);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    getCarFn(searchTerm);
  };

  // cuatom badges for car availability
  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 ">
            متاحة
          </Badge>
        );
      case "UNAVAILABLE":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 ">
            غير متاحة
          </Badge>
        );
      case "SOLD":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 ">
            مباعة
          </Badge>
        );
    }
  };

  // handling featured update
  const handleToggleFeatured = async (car) => {
    await updateCarFn(car.id, { featured: !car.featured });
  };

  // handling status update
  const handleStatusUpdate = async (car, newStatus) => {
    await updateCarFn(car.id, { status: newStatus });
  };

  // handling test drive availability update
  const handleTestDriveUpdate = async (car, newTestDriveAvailable) => {
    await updateCarFn(car.id, { testDriveAvailable: newTestDriveAvailable });
  };

  // handling delete update
  const handleDeleteCar = async (car) => {
    if (!carToDelete) return;

    await deleteCarFn(carToDelete.id);
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  // Call the getCarsFn on search term change
  useEffect(() => {
    getCarFn(searchTerm);
  }, [searchTerm]);

  // handling successful operations
  useEffect(() => {
    if (deletedCarData?.success) {
      toast.success("تم حذف السيارة بنجاح");
      getCarFn();
    }

    if (updatedCarData?.success) {
      // console.log(updatedCarData);
      toast.success("تم تحديث السيارة بنجاح");
      getCarFn(searchTerm);
    }
  }, [updatedCarData, deletedCarData]);

  // handling errors
  useEffect(() => {
    if (getCarsError) {
      toast.error("فشل في جلب السيارات");
    }
    if (updatedCarsError) {
      toast.error("فشل في تحديث السيارة");
    }
    if (deleteCarError) {
      toast.error("فشل في حذف السيارات");
    }
  }, [getCarsError, updatedCarsError, deleteCarError]);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Add car page */}
        <Link href="/admin/cars/create">
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4" /> إضافة سيارة
          </Button>
        </Link>

        {/* Search Field */}
        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              placeholder="بحث عن السيارات..."
              className="pl-9 w-full sm:w-60"
            />
          </div>
        </form>
      </div>

      {/* Cars Table */}
      <Card className="overflow-visible">
        <CardContent className="p-0">
          {getCarsLoading && !getCarsData ? (
            <div className="flex items-centr justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : getCarsData?.success && getCarsData.data?.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                {/* table Head */}
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right"></TableHead>
                    <TableHead className="text-right">الماركة والموديل</TableHead>
                    <TableHead className="text-right">السنة</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">مميزة</TableHead>
                    <TableHead className="text-right">اختبار قيادة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                {/* Tablebody - map all the cars */}
                <TableBody>
                  {getCarsData.data.map((car) => {
                    return (
                      <TableRow key={car.id}>
                        <TableCell className="w-16 h-16 rounded-md overflow-hidden">
                          {car.images && car.images.length > 0 ? (
                            // Image
                            <Image
                              src={car.images[0]}
                              alt={`${car.make} ${car.model}`}
                              height={64}
                              width={64}
                              className="w-full h-full object-cover"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <CarIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {car.make} {car.model}
                        </TableCell>
                        <TableCell>{car.year}</TableCell>
                        <TableCell>{formatSaudiRiyalReact(car.price)}</TableCell>
                        <TableCell>{getStatusBadge(car.status)} </TableCell>
                        {/* Featured */}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-9 w-9 cursor-pointer"
                            onClick={() => handleToggleFeatured(car)}
                            disabled={updateCarLoading}
                          >
                            {car.featured ? (
                              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                            ) : (
                              <StarOff className="h-5 w-5 text-gray-400" />
                            )}
                          </Button>
                        </TableCell>
                        {/* Test Drive Available */}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto cursor-pointer"
                            onClick={() => handleTestDriveUpdate(car, !car.testDriveAvailable)}
                            disabled={updateCarLoading}
                          >
                            <Badge className={car.testDriveAvailable ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}>
                              {car.testDriveAvailable ? "يوجد" : "لا يوجد"}
                            </Badge>
                          </Button>
                        </TableCell>
                        {/* Dropdown menu */}
                        <TableCell className="relative">
                          <DropdownMenu>
                            <DropdownMenuTrigger 
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                              onClick={() => console.log("Trigger clicked for car:", car.id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              align="end" 
                              className="w-56 z-[100]" 
                              dir="rtl" 
                              sideOffset={5}
                              onOpenAutoFocus={(e) => e.preventDefault()}
                            >
                              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => router.push(`/cars/${car.id}`)}
                              >
                                <Eye className="ml-2 h-4 w-4" /> عرض
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => router.push(`/admin/cars/edit/${car.id}`)}
                              >
                                <Edit className="ml-2 h-4 w-4" /> تعديل
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>الحالة</DropdownMenuLabel>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  handleStatusUpdate(car, "UNAVAILABLE");
                                }}
                                disabled={
                                  car.status === "UNAVAILABLE" ||
                                  updateCarLoading
                                }
                              >
                                {" "}
                                تعيين كغير متاحة
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  handleStatusUpdate(car, "AVAILABLE");
                                }}
                                disabled={
                                  car.status === "AVAILABLE" || updateCarLoading
                                }
                              >
                                تعيين كمتاحة
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  handleStatusUpdate(car, "SOLD");
                                }}
                                disabled={
                                  car.status === "SOLD" || updateCarLoading
                                }
                              >
                                تعيين كمباعة
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => {
                                  setCarToDelete(car);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="ml-2 h-4 w-4 text-red-600" />{" "}
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            // No cars in db
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <CarIcon className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                لم يتم العثور على سيارات
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "لا توجد سيارات تطابق معايير البحث"
                  : "مخزونك فارغ. أضف السيارات للبدء."}
              </p>
              <Button onClick={() => router.push("/admin/cars/create")}>
                أضف سيارتك الأولى
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog box */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              <span>
                هل أنت متأكد من حذف{" "}
                <strong className="text-gray-700">
                  {carToDelete?.make} {carToDelete?.model} ({carToDelete?.year})
                </strong>{" "}
                ؟ هذا الإجراء لا يمكن التراجع عنه.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteCarLoading}
            >
              إلغاء
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteCar}
              disabled={deleteCarLoading}
            >
              {deleteCarLoading ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin  cursor-pointer" />
              ) : (
                "حذف السيارة"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarList;
