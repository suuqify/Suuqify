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

// 1. JSON-ka Category walba u gaarka ah
interface PresetGroup {
    name: string;
    presetValues: string[];
}

const CATEGORY_SCHEMAS: Record<string, PresetGroup[]> = {
    // Dharka & Fashion
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
           name: "Size-ka Kabaha",
           presetValues: [
                          "20", "21", "22", "23", "24", "25", // Ilmaha yaryar (1-3 jir)
                          "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", // Carruurta (4-10 jir)
                          "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46" // Dhalinyarada & Dadka waaweyn
                          ],
           },
        
    ],
    // Kabaha
    shoes: [
        {
            name: "Size-ka Kabaha",
            presetValues: ["38", "39", "40", "41", "42", "43", "44", "45"],
        },
        {
            name: "Midabka",
            presetValues: ["Madow", "Caddaan", "Bunni", "Buluug"],
        },
    ],
    // Electronics & Moobillada & laptops
    electronics: [
        {
            name: "Xaalada (Condition)",
            presetValues: ["Cusub (New)", "Gacan Labaad (Used)"],
        },
        {
            name: "Midabka",
            presetValues: ["Black", "Silver", "Gold", "Blue", "Gray"],
        },
    ],
    // Beauty, Cadar Fregnances & Skincare
    beauty: [
        {
            name: "Ku Habboon (Target / Gender)",
            presetValues: ["Dumar (Women)", "Rag (Men)", "Labada Qofba (Unisex)"],
        },
        {
            name: "Nooca Maqaarka (Skin Type)",
            presetValues: [
                "Oily (Dux leh)",
                "Dry (Qallalan)",
                "Sensitive (Xasaasi)",
                "Combination (Isku-dhaf)",
                "All Skin Types (Dhammaan)"
            ],
        },
    ],
    // Cunto & Maqaayado
    food: [
        {
            name: "Qaybta",
            presetValues: ["Hal Qof", "Labo Qof", "Family Pack"],
        },
        {
            name: "Dookha",
            presetValues: ["Basbaas leh", "Basbaas la'aan"],
        },
    ],
    // Haddii la waayo wax la mid ah (General fallback)
    General: [
         {
            name: "Xaaladda (Condition)",
            presetValues: ["Cusub (New)", "Gacan Labaad (Used)"],
        },
        {
            name: "Qaybta Guriga (Room / Space)",
            presetValues: [
                "Qolka Fadhiga (Living Room)",
                "Qolka Jiifka (Bedroom)",
                "Jikada (Kitchen)",
                "Musqusha (Bathroom)",
                "Guud ahaan Guriga (General Home)"
            ],
        },
        {
            name: "Maaddada (Material)",
            presetValues: [
                "Alwaax (Wood)",
                "Bir (Metal)",
                "Caag (Plastic)",
                "Dhalo (Glass)",
                "Maro / Suuf (Fabric)",
                "Dhoobo / Ceramics"
            ],
        },
    ],
    Supplements: [
        {
            name: "Body Type",
            presetValues: ["Slim / Weight Gain", "Weight Loss / Cutting", "Lean Muscle / Athletic", "All Bodies"],
        },
        
    ],
     Travel: [
        {
            name: "Visa Type",
            presetValues: ["Tourist / Vacation", "Student / Education", "Medical / Health", "Business", "Work / Employment", "Visit / Family", "Transit", "Umrah & Hajj"],
        },
         {
            name: "Visa Duration",
            presetValues: ["7 Days", "14 Days", "1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "2+ Years"],
        },
       
    ],
   Vehicles: [
        {
            name: "Nooca (Status)",
            presetValues: ["Iib (For Sale)", "Kiro (For Rent)"],
        },
        {
            name: "Xaaladda (Condition)",
            presetValues: ["Cusub (New)", "Gacan Labaad (Used)"],
        },
    ],
    RealState: [
        {
            name: "Nooca (Status)",
            presetValues: ["Iib (For Sale)", "Kiro (For Rent)"],
        },
        {
            name: "Nooca Hantida (Property Type)",
            presetValues: ["Guri (House)", "Dabaq (Apartment)", "Dhul (Land)", "Ganacsi (Commercial)"],
        },
    ],
   
};

// Function si automatic ah u ogaanaya Category-ga saxda ah ee dukaanka
function matchCategoryKey(catName?: string): string {
    if (!catName) return "fashion";
    const name = catName.toLowerCase();

    if (name.includes("kabo") || name.includes("shoe")) return "shoes";
    if (name.includes("elect") || name.includes("moobil") || name.includes("phone") || name.includes("tech")) return "electronics";
    if (name.includes("beauty") || name.includes("cadar") || name.includes("skincare") || name.includes("cosmetic")) return "beauty";
    if (name.includes("food") || name.includes("cunto") || name.includes("maqaayad")) return "food";
    if (name.includes("dhar") || name.includes("fashion") || name.includes("maro") || name.includes("style")) return "fashion";

    return "general";
}

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
    storeCategoryName?: string; // Waxaa soo diraya dukaanka
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

    // Xulashada Category-ga dukaanka toos
    const categoryKey = matchCategoryKey(storeCategoryName);
    const categoryPresets = CATEGORY_SCHEMAS[categoryKey] || CATEGORY_SCHEMAS.general;

    // Qiimayaasha la doortay: { "Cabbir (Size)": ["M", "L"] }
    const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});
    // Input-yada mid cusub lagu darsanayo
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

    // Pill Toggle (Hal-gujis ku dooro / ka noqo)
    const toggleValue = (groupName: string, value: string) => {
        setSelectedValues((prev) => {
            const current = prev[groupName] || [];
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            return { ...prev, [groupName]: updated };
        });
    };

    // Ku dar qiimo cusub oo gacanta ah
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

    // Image Upload
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

        // Options-ka la doortay oo kaliya u dir database-ka
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
            {/* Modal Responsive: Full-width on mobile with comfortable padding and auto scroll */}
            <DialogContent className="w-[96vw] max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-xl">
                <DialogHeader className="pb-2 border-b">
                    <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
    {isEditing ? "Wax ka beddel" : "Ku dar Shay Cusub"}
</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* 1. Sawirka Alaabta */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase">
                            Sawirka Adeega/Alaabta
                        </Label>
                        <div className="flex items-center gap-3">
                            {image ? (
                                <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border border-border shrink-0">
                                    <Image src={image} alt="Product" fill className="object-cover" />
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

                    {/* 2. Magaca & Qiimaha (Single Row or clean grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="sm:col-span-2 space-y-1">
                            <Label htmlFor="prod-name" className="text-xs font-semibold text-foreground">
                                Magaca Adeega/Alaabta *
                            </Label>
                            <Input
                                id="prod-name"
                                placeholder="Geli Magaca....."
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

                    {/* 3. Sharraxaadda Alaabta (Description) */}
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

                    {/* 4. In Stock Toggle */}
                    <div className="flex items-center justify-between border border-border/80 rounded-xl p-2.5 bg-muted/20">
                        <div>
                            <p className="text-xs font-semibold text-foreground">Hada mala heli karaa (In Stock)?</p>
                            <p className="text-[10px] text-muted-foreground">Macaamiishu hadda ma dalban karaan?</p>
                        </div>
                        <Switch checked={inStock} onCheckedChange={setInStock} />
                    </div>

                    {/* 5. Automatic Options by Store Category (Zero Switcher - Only Store Category) */}
                    <div className="pt-2 border-t space-y-3">
                        <div>
                            <Label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-primary" />
                                doorashooyinka Kale(Options)
                            </Label>
                            <p className="text-[11px] text-muted-foreground">
                                Taabo xulashooyinka kale oo diyaar kuu ah 
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

                                        {/* Clickable Pills (Mobile-Friendly Wrapping) */}
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

                                        {/* Ku dar mid kale (Mobile Responsive Row) */}
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

                    {/* Dialog Footer (Equally split on mobile) */}
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
                            {isEditing ? "Keydi" : "Add New"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}