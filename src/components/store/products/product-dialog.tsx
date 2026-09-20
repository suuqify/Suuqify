"use client";

import { useState, useTransition, useEffect } from "react";
import { Product, ProductOption } from "./types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import {
    createProductAction,
    updateProductAction,
} from "@/actions/store/products/mutation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, UploadCloud, X } from "lucide-react";
import Image from "next/image";

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
}

export function ProductDialog({ open, onOpenChange, product }: ProductDialogProps) {
    const isEditing = !!product;
    const [isPending, startTransition] = useTransition();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [inStock, setInStock] = useState(true);
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Kala-doorashooyinka (Options)
    const [options, setOptions] = useState<ProductOption[]>([]);
    const [tempValue, setTempValue] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price.toString());
            setInStock(product.in_stock);
            setImage(product.image);
            setOptions(product.options || []);
        } else {
            setName("");
            setPrice("");
            setInStock(true);
            setImage(null);
            setOptions([]);
        }
    }, [product, open]);

    // Soo gelinta sawirka (Supabase Storage: bucket 'products')
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Sawirku waa inuu ka yaraadaa 5MB");
            return;
        }

        try {
            setUploading(true);
            const supabase = await createClient();
            const ext = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
            const filePath = `items/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("products")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("products").getPublicUrl(filePath);
            setImage(data.publicUrl);
            toast.success("Sawirka waa la soo geliyay");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Khalad ayaa dhacay sawirka";
            toast.error(message);
        } finally {
            setUploading(false);
        }
    };

    // Option Operations
    const handleAddOptionGroup = () => {
        setOptions([...options, { name: "", values: [] }]);
    };

    const handleRemoveOptionGroup = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleOptionNameChange = (index: number, val: string) => {
        const updated = [...options];
        updated[index].name = val;
        setOptions(updated);
    };

    const handleAddValue = (index: number) => {
        const val = tempValue[index]?.trim();
        if (!val) return;
        const updated = [...options];
        if (!updated[index].values.includes(val)) {
            updated[index].values.push(val);
            setOptions(updated);
        }
        setTempValue({ ...tempValue, [index]: "" });
    };

    const handleRemoveValue = (optIndex: number, valIndex: number) => {
        const updated = [...options];
        updated[optIndex].values = updated[optIndex].values.filter((_, i) => i !== valIndex);
        setOptions(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !price) {
            toast.error("Fadlan geli magaca iyo qiimaha");
            return;
        }

        // Nadiifi options-ka aan lahayn magac ama qiime
        const cleanOptions = options
            .filter((opt) => opt.name.trim() !== "" && opt.values.length > 0)
            .map((opt) => ({ name: opt.name.trim(), values: opt.values }));

        startTransition(async () => {
            const payload = {
                name,
                price: parseFloat(price),
                image,
                in_stock: inStock,
                options: cleanOptions,
            };

            const res = isEditing
                ? await updateProductAction(product.id, payload)
                : await createProductAction(payload);

            if (res.success) {
                toast.success(
                    isEditing ? "Alaabta waa la cusboonaysiiyay" : "Alaab cusub waa la daray"
                );
                onOpenChange(false);
            } else {
                toast.error(res.error || "Khalad ayaa dhacay");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEditing ? "Wax ka beddel Alaabta" : "Ku dar Alaab Cusub"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Sawirka */}
                    <div>
                        <Label className="text-sm font-medium">Sawirka Alaabta</Label>
                        <div className="mt-1.5 flex items-center gap-4">
                            {image ? (
                                <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-border">
                                    <Image src={image} alt="Product" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImage(null)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-24 h-20 border-2 border-dashed rounded-lg border-border hover:bg-muted/50 cursor-pointer transition-colors">
                                    {uploading ? (
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                    ) : (
                                        <>
                                            <UploadCloud className="h-5 w-5 text-muted-foreground" />
                                            <span className="text-[11px] text-muted-foreground mt-1">Upload</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploading}
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Magaca */}
                    <div className="space-y-1.5">
                        <Label htmlFor="prod-name">Magaca Alaabta *</Label>
                        <Input
                            id="prod-name"
                            placeholder="Tusaale: Cabaayad Madow ama iPhone 15"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Qiimaha */}
                    <div className="space-y-1.5">
                        <Label htmlFor="prod-price">Qiimaha ($) *</Label>
                        <Input
                            id="prod-price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="25.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    {/* In Stock Toggle */}
                    <div className="flex items-center justify-between border rounded-lg p-3 bg-muted/10">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">Alaabtu ma taallaa (In Stock)?</Label>
                            <p className="text-xs text-muted-foreground">Macaamiishu ma dalban karaan hadda?</p>
                        </div>
                        <Switch checked={inStock} onCheckedChange={setInStock} />
                    </div>

                    {/* Dynamic Options Section (Is-galiye Xor ah) */}
                    <div className="space-y-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-semibold">
                                    Kala-doorashooyinka (Options)
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Ku dar midab, cabbir, kayd ama wixii doorasho ah (Ikhtiyaari)
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddOptionGroup}
                                className="h-8 text-xs gap-1"
                            >
                                <Plus className="h-3.5 w-3.5" /> Ku dar Option
                            </Button>
                        </div>

                        {options.map((option, optIdx) => (
                            <div
                                key={optIdx}
                                className="p-3 bg-card rounded-lg space-y-2.5 border shadow-2xs"
                            >
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Magaca doorashada (sida: Midab, Cabbir, GB...)"
                                        value={option.name}
                                        onChange={(e) => handleOptionNameChange(optIdx, e.target.value)}
                                        className="h-8 text-sm font-medium"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                        onClick={() => handleRemoveOptionGroup(optIdx)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex gap-1.5">
                                    <Input
                                        placeholder="Qor qiimaha (sida: XL, Madow, 128GB) kadibna riix Add"
                                        value={tempValue[optIdx] || ""}
                                        onChange={(e) =>
                                            setTempValue({ ...tempValue, [optIdx]: e.target.value })
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddValue(optIdx);
                                            }
                                        }}
                                        className="h-8 text-xs"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="h-8 text-xs font-medium"
                                        onClick={() => handleAddValue(optIdx)}
                                    >
                                        Add
                                    </Button>
                                </div>

                                {option.values.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {option.values.map((v, vIdx) => (
                                            <Badge
                                                key={vIdx}
                                                variant="outline"
                                                className="bg-muted/60 text-xs py-0.5 px-2 flex items-center gap-1 font-normal"
                                            >
                                                {v}
                                                <X
                                                    className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground ml-0.5"
                                                    onClick={() => handleRemoveValue(optIdx, vIdx)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Ka noqo
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || uploading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Keydi Isbeddelka" : "Ku dar Alaabta"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}