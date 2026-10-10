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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";
import {
    createProductAction,
    updateProductAction,
} from "@/actions/store/products/mutation";
import { toast } from "sonner";
import {
    Loader2,
    UploadCloud,
    X,
    Check,
    Plus,
    Sparkles,
} from "lucide-react";
import Image from "next/image";

interface PresetGroup {
    name: string;
    presetValues: string[];
}

// 1. Dhammaan 7-da Qaybood (Waa wada xarfo yaryar si uusan marnaba u crash-gareyn)
const CATEGORY_SCHEMAS: Record<string, PresetGroup[]> = {
    // 1. Dharka, Fashion & Kabaha
    fashion: [
        {
            name: "Cabbir (Size)",
            presetValues: ["S", "M", "L", "XL", "2XL", "3XL", "Free Size"],
        },
        {
            name: "Midab (Color)",
            presetValues: ["Madow", "Caddaan", "Buluug", "Casaan", "Cagaar", "Bunni", "Jaalle"],
        },
        {
            name: "Cabbirka Kabaha (Shoe Size)",
            presetValues: [
                "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"
            ],
        },
    ],

    // 2. Electronics & Moobillada
    electronics: [
        {
            name: "Xaaladda (Condition)",
            presetValues: ["Cusub (New)", "Gacan Labaad (Used)"],
        },
        {
            name: "Kaydka (Storage)",
            presetValues: ["64GB", "128GB", "256GB", "512GB", "1TB"],
        },
        {
            name: "Midabka",
            presetValues: ["Black", "Silver", "Gold", "Blue", "Gray", "Titanium"],
        },
    ],

    // 3. Beauty, Skincare & Cadar
    beauty: [
        {
            name: "Ku Habboon (Target)",
            presetValues: ["Dumar (Women)", "Rag (Men)", "Labada Qofba (Unisex)"],
        },
        {
            name: "Nooca Maqaarka (Skin Type)",
            presetValues: [
                "Dux leh (Oily)",
                "Qallalan (Dry)",
                "Xasaasi (Sensitive)",
                "Isku-dhaf (Combination)",
                "Dhammaan Maqaarka"
            ],
        },
    ],

    // 4. Borotiinka & Jimicsiga (Supplements)
    supplements: [
        {
            name: "Ujeeddada (Goal)",
            presetValues: [
                "Dhisidda Muruqa (Muscle Build)",
                "Miisaan Kordhin (Weight Gain)",
                "Miisaan Dhimis (Fat Loss)",
                "Awood & Tamar (Pre-Workout)"
            ],
        },
        {
            name: "Dhadhanka (Flavor)",
            presetValues: ["Chocolate", "Vanilla", "Strawberry", "Banana", "Unflavored"],
        },
    ],

    // 5. Fiisooyinka & Safarrada (Travel & Visas)
    travel: [
        {
            name: "Nooca Fiisaha (Visa Type)",
            presetValues: [
                "Dalxiis (Tourist)",
                "Waxbarasho (Student)",
                "Ganacsi (Business)",
                "Caafimaad (Medical)",
                "Cumro & Xajj",
                "Shaqo (Employment)"
            ],
        },
        {
            name: "Muddada (Duration)",
            presetValues: ["14 Maalmood", "1 Bil", "2 Bilood", "3 Bilood", "6 Bilood", "1 Sano"],
        },
    ],

    // 6. Baabuurta & Gaadiidka (Vehicles)
    vehicles: [
        {
            name: "Xaaladda (Condition)",
            presetValues: ["Cusub (New)", "Gacan Labaad (Used)"],
        },
        {
            name: "Nooca (Status)",
            presetValues: ["Iib (For Sale)", "Kiro (For Rent)"],
        },
        {
            name: "Transmishinka (Gear)",
            presetValues: ["Automatic", "Manual"],
        },
    ],

    // 7. Guryaha & Dhulka (Real Estate)
    realestate: [
        {
            name: "Nooca (Status)",
            presetValues: ["Iib (For Sale)", "Kiro (For Rent)"],
        },
        {
            name: "Nooca Hantida (Property Type)",
            presetValues: [
                "Guri (House)",
                "Dabaq (Apartment)",
                "Dhul (Land)",
                "Villa",
                "Xafiis / Ganacsi"
            ],
        },
    ],

    // Fallback Guud (General)
    general: [
        {
            name: "Xaaladda (Condition)",
            presetValues: ["Cusub (New)", "Gacan Labaad (Used)"],
        },
        {
            name: "Nooca (Status)",
            presetValues: ["Iib (For Sale)", "Kiro (For Rent)"],
        },
    ],
};

// 2. Shaqada garanaysa Category walba oo aan marnaba qalad samaynayn
function matchCategoryKey(catName?: string): string {
    if (!catName) return "general";
    const name = catName.toLowerCase().trim();

    // Vehicles
    if (
        name.includes("vehic") ||
        name.includes("gaari") ||
        name.includes("baabuur") ||
        name.includes("car") ||
        name.includes("moto")
    ) return "vehicles";

    // Real Estate
    if (
        name.includes("real") ||
        name.includes("estate") ||
        name.includes("guri") ||
        name.includes("dhul") ||
        name.includes("property") ||
        name.includes("dabaq")
    ) return "realestate";

    // Travel & Visas
    if (
        name.includes("travel") ||
        name.includes("visa") ||
        name.includes("fiiso") ||
        name.includes("dalxiis") ||
        name.includes("saf") ||
        name.includes("umrah") ||
        name.includes("hajj")
    ) return "travel";

    // Supplements & Gym
    if (
        name.includes("supp") ||
        name.includes("protein") ||
        name.includes("borotiin") ||
        name.includes("gym") ||
        name.includes("fit")
    ) return "supplements";

    // Electronics & Tech
    if (
        name.includes("elect") ||
        name.includes("moobil") ||
        name.includes("phone") ||
        name.includes("laptop") ||
        name.includes("tech")
    ) return "electronics";

    // Beauty & Skincare
    if (
        name.includes("beauty") ||
        name.includes("cadar") ||
        name.includes("perfume") ||
        name.includes("skincare") ||
        name.includes("cosmetic")
    ) return "beauty";

    // Fashion & Shoes
    if (
        name.includes("dhar") ||
        name.includes("fashion") ||
        name.includes("kabo") ||
        name.includes("shoe") ||
        name.includes("maro") ||
        name.includes("style")
    ) return "fashion";

    return "general";
}

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
    storeCategoryName?: string;
}

export function ProductDialog({
    open,
    onOpenChange,
    product,
    storeCategoryName,
}: ProductDialogProps) {
    const isEditing = !!product;
    const [isPending, startTransition] = useTransition();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [inStock, setInStock] = useState(true);
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Xulashada Category-ga dukaanka (Haddii la waayo waxay had iyo jeer si nabad ah u aadaysaa general)
    const categoryKey = matchCategoryKey(storeCategoryName);
    const categoryPresets = CATEGORY_SCHEMAS[categoryKey] || CATEGORY_SCHEMAS["general"] || [];

    const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});
    const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price.toString());
            setDescription(product.description || "");
            setInStock(product.in_stock);
            setImage(product.image);

            const initialSelected: Record<string, string[]> = {};
            if (product.options && Array.isArray(product.options)) {
                product.options.forEach((opt) => {
                    initialSelected[opt.name] = opt.values;
                });
            }
            setSelectedValues(initialSelected);
        } else {
            setName("");
            setPrice("");
            setDescription("");
            setInStock(true);
            setImage(null);
            setSelectedValues({});
        }
    }, [product, open]);

    const toggleValue = (groupName: string, value: string) => {
        setSelectedValues((prev) => {
            const current = prev[groupName] || [];
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            return { ...prev, [groupName]: updated };
        });
    };

    const handleAddCustomValue = (groupName: string) => {
        const val = customInputs[groupName]?.trim();
        if (!val) return;

        setSelectedValues((prev) => {
            const current = prev[groupName] || [];
            if (!current.includes(val)) {
                return { ...prev, [groupName]: [...current, val] };
            }
            return prev;
        });

        setCustomInputs((prev) => ({ ...prev, [groupName]: "" }));
    };

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !price) {
            toast.error("Fadlan geli magaca iyo qiimaha");
            return;
        }

        const formattedOptions: ProductOption[] = Object.entries(selectedValues)
            .filter(([_, vals]) => vals && vals.length > 0)
            .map(([groupName, vals]) => ({
                name: groupName,
                values: vals,
            }));

        startTransition(async () => {
            const payload = {
                name,
                description,
                price: parseFloat(price),
                image,
                in_stock: inStock,
                options: formattedOptions,
            };

            const res = isEditing
                ? await updateProductAction(product.id, payload)
                : await createProductAction(payload);

            if (res.success) {
                toast.success(
                    isEditing
                        ? "Si guul leh baa loo cusboonaysiiyay!"
                        : "Si guul leh baa loogu daray website-kaaga!"
                );
                onOpenChange(false);
            } else {
                toast.error(res.error || "Khalad ayaa dhacay");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[96vw] max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-xl">
                <DialogHeader className="pb-2 border-b">
                    <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                        {isEditing ? "Wax ka beddel" : "Ku dar mid Cusub"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* 1. Sawirka */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase">
                            Sawirka Adeega ama Alaabta
                        </Label>
                        <div className="flex items-center gap-3">
                            {image ? (
                                <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border border-border shrink-0">
                                    <Image src={image} alt="Sawirka" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImage(null)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex items-center justify-center gap-2 h-16 w-full sm:w-44 border-2 border-dashed rounded-xl border-border/80 hover:bg-muted/40 cursor-pointer transition-colors px-3">
                                    {uploading ? (
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                    ) : (
                                        <>
                                            <UploadCloud className="h-5 w-5 text-primary" />
                                            <span className="text-xs font-semibold text-foreground">Soo Geli Sawir</span>
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

                    {/* 2. Magaca & Qiimaha */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="sm:col-span-2 space-y-1">
                            <Label htmlFor="prod-name" className="text-xs font-semibold text-foreground">
                                Magaca Adeega ama Alaabta *
                            </Label>
                            <Input
                                id="prod-name"
                                placeholder="Geli magaca..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-10 text-xs sm:text-sm rounded-xl"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="prod-price" className="text-xs font-semibold text-foreground">
                                Qiimaha ($) *
                            </Label>
                            <Input
                                id="prod-price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="20.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="h-10 text-xs sm:text-sm font-semibold rounded-xl"
                            />
                        </div>
                    </div>

                    {/* 3. Faahfaahinta */}
                    <div className="space-y-1">
                        <Label htmlFor="prod-desc" className="text-xs font-semibold text-foreground">
                            Faahfaahinta Dheeraadka ah (Ikhtiyaari)
                        </Label>
                        <Textarea
                            id="prod-desc"
                            rows={2}
                            placeholder="Faahfaahin kooban oo ku saabsan..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="text-xs rounded-xl resize-none"
                        />
                    </div>

                    {/* 4. Diyaar ma yahay? */}
                    <div className="flex items-center justify-between border border-border/80 rounded-xl p-2.5 bg-muted/20">
                        <div>
                            <p className="text-xs font-semibold text-foreground">Diyaar ma yahay hadda?</p>
                            <p className="text-[10px] text-muted-foreground">Macaamiishu hadda ma arki karaan oo ma heli karaan?</p>
                        </div>
                        <Switch checked={inStock} onCheckedChange={setInStock} />
                    </div>

                    {/* 5. Kala-doorashooyinka (Options) */}
                    <div className="pt-2 border-t space-y-3">
                        <div>
                            <Label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-primary" />
                                Kala-doorashooyinka (Options)
                            </Label>
                            <p className="text-[11px] text-muted-foreground">
                                Taabo xulashooyinka diyaar kuu ah
                            </p>
                        </div>

                        {/* Interactive Pill Groups */}
                        <div className="space-y-3">
                            {categoryPresets.map((group) => {
                                const selectedInThisGroup = selectedValues[group.name] || [];
                                const allDisplayValues = Array.from(
                                    new Set([...group.presetValues, ...selectedInThisGroup])
                                );

                                return (
                                    <div
                                        key={group.name}
                                        className="rounded-xl border border-border/80 bg-muted/15 p-2.5 sm:p-3 space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-foreground">
                                                {group.name}
                                            </span>
                                            {selectedInThisGroup.length > 0 && (
                                                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                    {selectedInThisGroup.length} la doortay
                                                </span>
                                            )}
                                        </div>

                                        {/* Clickable Pills */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {allDisplayValues.map((val) => {
                                                const isSelected = selectedInThisGroup.includes(val);
                                                return (
                                                    <button
                                                        key={val}
                                                        type="button"
                                                        onClick={() => toggleValue(group.name, val)}
                                                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer select-none active:scale-95 ${isSelected
                                                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                                            : "bg-background text-foreground border-border/80 hover:bg-muted"
                                                            }`}
                                                    >
                                                        {isSelected && <Check className="h-3 w-3 stroke-3" />}
                                                        <span>{val}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Ku dar mid kale */}
                                        <div className="flex items-center gap-1.5 pt-1">
                                            <Input
                                                placeholder={`Mid kale (${group.name})...`}
                                                value={customInputs[group.name] || ""}
                                                onChange={(e) =>
                                                    setCustomInputs({
                                                        ...customInputs,
                                                        [group.name]: e.target.value,
                                                    })
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleAddCustomValue(group.name);
                                                    }
                                                }}
                                                className="h-8 text-xs rounded-lg bg-background flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAddCustomValue(group.name)}
                                                className="h-8 px-2.5 text-xs rounded-lg shrink-0 gap-1"
                                            >
                                                <Plus className="h-3.5 w-3.5" /> Ku dar
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dialog Footer */}
                    <DialogFooter className="pt-2 border-t grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="h-10 text-xs sm:text-sm rounded-xl w-full sm:w-auto"
                        >
                            Ka noqo
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || uploading}
                            className="h-10 text-xs sm:text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto gap-1.5"
                        >
                            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEditing ? "Keydi Isbeddelka" : "Ku dar Hadda"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}