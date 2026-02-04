"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPublicMandebs } from "@/actions/mandeb";
import { User, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MandebSelector = ({ isOpen, onOpenChange, car }) => {
    const [mandebs, setMandebs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMandebs = async () => {
            if (isOpen) {
                setLoading(true);
                const result = await getPublicMandebs();
                if (result.success) {
                    setMandebs(result.data);
                }
                setLoading(false);
            }
        };
        fetchMandebs();
    }, [isOpen]);

    const handleMandebClick = (mandeb) => {
        const carUrl = window.location.href;
        const message = `السلام عليكم ورحمة الله وبركاته،\n` +
            `أرغب في الاستفسار عن السيارة التالية:\n` +
            `السيارة: ${car.year} ${car.make} ${car.model}\n` +
            `السعر: ${car.price}\n` +
            `الرابط: ${carUrl}`;

        const whatsappUrl = `https://wa.me/${mandeb.phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent dir="rtl" className="sm:max-w-[500px] bg-zinc-950 text-white border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center mb-4">اختيار مندوب المبيعات</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
                    </div>
                ) : mandebs.length > 0 ? (
                    <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2">
                        {mandebs.map((mandeb) => (
                            <Card
                                key={mandeb.id}
                                className="bg-zinc-900 border-zinc-800 hover:border-yellow-600 transition-all cursor-pointer group"
                                onClick={() => handleMandebClick(mandeb)}
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-yellow-600/10 p-3 rounded-full group-hover:bg-yellow-600/20 transition-colors">
                                            <User className="h-6 w-6 text-yellow-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-white group-hover:text-yellow-500 transition-colors">
                                                {mandeb.name}
                                            </h4>
                                            <div className="flex items-center gap-1 text-zinc-400 text-sm mt-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{mandeb.city}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="text-yellow-600 hover:text-yellow-500 hover:bg-yellow-600/10">
                                        تواصل الآن
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-zinc-400">
                        لا يوجد مناديب متاحين حالياً
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default MandebSelector;
