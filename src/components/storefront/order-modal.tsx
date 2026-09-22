"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, Package, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StorefrontProduct } from "./types";

interface OrderModalProps {
    product: StorefrontProduct | null;
    storeName: string;
    whatsappNumber: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OrderModal({
    product,
    storeName,
    whatsappNumber,
    open,
    onOpenChange,
}: OrderModalProps) {
    // Keydi doorashooyinka macmiilka (tusaale: { "Midab": "Black", "Cabbir": "XL" })
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

    if (!product) return null;

    const handleSelectOption = (groupName: string, value: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [groupName]: value,
        }));
    };

    const handleSendOrder = () => {
        // Nadiifi lambarka WhatsApp-ka (ka saar calaamadaha dheeraadka ah)
        let cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
        if (cleanPhone.startsWith("0")) {
            cleanPhone = "252" + cleanPhone.substring(1);
        } else if (!cleanPhone.startsWith("252") && cleanPhone.length === 9) {
            cleanPhone = "252" + cleanPhone;
        }

        // Farriinta WhatsApp-ka
        let message = `Asc *${storeName}*, waxaan rabaa inaan dalbado alaabtan:\n\n`;
        message += `🛍️ *Alaabta:* ${product.name}\n`;
        message += `💵 *Qiimaha:* $${Number(product.price).toFixed(2)}\n`;

        // Ku dar kala-doorashooyinkii hadday jiraan
        const optionKeys = Object.keys(selectedOptions);
        if (optionKeys.length > 0) {
            message += `📋 *Doorashooyinka:*\n`;
            optionKeys.forEach((key) => {
                message += `   • ${key}: ${selectedOptions[key]}\n`;
            });
        }

        message += `\nFadlan ii xaqiiji dalabkayga iyo qaabka aan ku heli karo. Mahadsanid!`;

        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold flex items-center justify-between">
                        <span className="truncate pr-2">{product.name}</span>
                        <span className="text-primary font-black text-xl shrink-0">
                            ${Number(product.price).toFixed(2)}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-1">
                    {/* Sawirka Alaabta */}
                    <div className="relative h-48 w-full rounded-xl overflow-hidden bg-muted border">
                        {product.image ? (
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/40">
                                <Package className="h-12 w-12" />
                            </div>
                        )}
                    </div>

                    {/* Doorashooyinka (Options: Color, Size, etc.) */}
                    {product.options && product.options.length > 0 && (
                        <div className="space-y-3 pt-2 border-t">
                            {product.options.map((optGroup, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                                        {optGroup.name}:
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {optGroup.values.map((val, valIdx) => {
                                            const isSelected = selectedOptions[optGroup.name] === val;
                                            return (
                                                <button
                                                    key={valIdx}
                                                    type="button"
                                                    onClick={() => handleSelectOption(optGroup.name, val)}
                                                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${isSelected
                                                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                                        : "bg-background text-foreground hover:bg-muted border-border"
                                                        }`}
                                                >
                                                    {isSelected && <Check className="h-3 w-3 stroke-3" />}
                                                    {val}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-4 border-t gap-2">
                    <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
                        Ka noqo
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSendOrder}
                        className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold shadow-sm"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Ku Dalbo WhatsApp
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}