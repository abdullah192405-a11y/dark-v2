"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Edit,
    Loader2,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { React, useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    getMandebs,
    deleteMandeb,
} from "@/actions/mandeb";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MandebDialog from "./MandebDialog";

const MandebList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [mandebs, setMandebs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mandebToDelete, setMandebToDelete] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editMandeb, setEditMandeb] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchMandebs = async () => {
        setLoading(true);
        try {
            const result = await getMandebs();
            if (result.success) {
                setMandebs(result.data);
            } else {
                toast.error(result.error || "فشل في جلب البيانات");
            }
        } catch (error) {
            toast.error("حدث خطأ ما");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMandebs();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    const filteredMandebs = mandebs.filter((mandeb) =>
        mandeb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mandeb.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mandeb.phone.includes(searchTerm)
    );

    const handleDeleteMandeb = async () => {
        if (!mandebToDelete) return;
        setDeleteLoading(true);
        try {
            const result = await deleteMandeb(mandebToDelete.id);
            if (result.success) {
                toast.success("تم حذف المندوب بنجاح");
                fetchMandebs();
                setDeleteDialogOpen(false);
                setMandebToDelete(null);
            } else {
                toast.error(result.error || "فشل في الحذف");
            }
        } catch (error) {
            toast.error("حدث خطأ ما");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEditMandeb = (mandeb) => {
        setEditMandeb(mandeb);
        setDialogOpen(true);
    };

    const handleAddMandeb = () => {
        setEditMandeb(null);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditMandeb(null);
    };

    const handleSaveSuccess = () => {
        fetchMandebs();
        handleCloseDialog();
    };

    return (
        <div className="space-y-4" dir="rtl">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <Button className="cursor-pointer" onClick={handleAddMandeb}>
                    <Plus className="h-4 w-4 ml-2" /> إضافة مندوب
                </Button>

                <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="search"
                            placeholder="بحث عن المناديب..."
                            className="pr-9 w-full sm:w-60"
                        />
                    </div>
                </form>
            </div>

            <Card className="overflow-visible">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : filteredMandebs.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-right">اسم المندوب</TableHead>
                                        <TableHead className="text-right">الرقم</TableHead>
                                        <TableHead className="text-right">المدينة</TableHead>
                                        <TableHead className="text-right">تاريخ الإضافة</TableHead>
                                        <TableHead className="text-left">الإجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMandebs.map((mandeb) => (
                                        <TableRow key={mandeb.id}>
                                            <TableCell className="font-medium">{mandeb.name}</TableCell>
                                            <TableCell>{mandeb.phone}</TableCell>
                                            <TableCell>{mandeb.city}</TableCell>
                                            <TableCell>{new Date(mandeb.createdAt).toLocaleDateString("ar-SA")}</TableCell>
                                            <TableCell className="text-left">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" dir="rtl">
                                                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEditMandeb(mandeb)}>
                                                            <Edit className="ml-2 h-4 w-4" /> تعديل
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setMandebToDelete(mandeb);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="ml-2 h-4 w-4" /> حذف
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                لم يتم العثور على مناديب
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm
                                    ? "لا توجد نتائج تطابق معايير البحث"
                                    : "قائمتك فارغة. أضف مندوباً للبدء."}
                            </p>
                            <Button onClick={handleAddMandeb}>أضف مندوباً</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-[#0a0a0a] text-white border-zinc-800" dir="rtl">
                    <DialogHeader className="text-right sm:text-right">
                        <DialogTitle className="text-xl font-bold text-white">تأكيد الحذف</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-right">
                            هل أنت متأكد من حذف المندوب <strong>{mandebToDelete?.name}</strong>؟ هذا الإجراء لا يمكن التراجع عنه.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0 sm:justify-start flex-row mt-4">
                        <Button
                            variant="destructive"
                            onClick={handleDeleteMandeb}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : "حذف المندوب"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleteLoading}
                            className="text-zinc-400 hover:text-white hover:bg-zinc-900"
                        >
                            إلغاء
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add/Edit Dialog */}
            <MandebDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                mandeb={editMandeb}
                onSuccess={handleSaveSuccess}
            />
        </div>
    );
};

export default MandebList;
