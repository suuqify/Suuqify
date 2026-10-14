"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, X, Check, Lock, MapPin, Phone, Tag, Loader2, Eraser } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { updateStoreGeneralAction } from "@/actions/store/settings";
import { StoreData, City, Category } from "./types";

interface GeneralFormData {
    name: string;
    whatsapp_number: string;
    city_ids: string[];
    category_id: string;
    location: string;
    bio: string;
    about: string;
}

interface GeneralTabProps {
    store: StoreData;
    userEmail: string;
    cities: City[];
    categories: Category[];
}

export function GeneralTab({ store, userEmail, cities, categories }: GeneralTabProps) {
    const [isPending, startTransition] = useTransition();
    const [isEditing, setIsEditing] = useState(false);

    const initialCityIds: string[] =
        store.city_ids && store.city_ids.length > 0
            ? store.city_ids
            : store.city_id ? [store.city_id] : [];

    const [formData, setFormData] = useState<GeneralFormData>({
        name: store.name ?? "",
        whatsapp_number: store.whatsapp_number ?? "",
        city_ids: initialCityIds,
        category_id: store.category_id ?? "",
        location: store.location ?? "",
        bio: store.bio ?? "",
        about: store.about ?? "",
    });

    const getCityName = (id: string) => {
        const found = cities.find((c) => c.id === id);
        return found ? found.name : id;
    };

    const getCategoryName = (idOrName: string) => {
        if (!idOrName) return "Lama dooran";
        const found = categories.find(
            (c) => c.id === idOrName || c.name.toLowerCase() === idOrName.toLowerCase()
        );
        return found ? found.name : "Lama dooran";
    };

    const toggleCity = (cityId: string) => {
        setFormData((prev) => ({
            ...prev,
            city_ids: prev.city_ids.includes(cityId)
                ? prev.city_ids.filter((id) => id !== cityId)
                : [...prev.city_ids, cityId],
        }));
    };

    // -------------------------------------------------------------
    // FARSAMADA KA HORTAGTA INUU BROWSER-KU FREEZE / CRASH DHAHO:
    // -------------------------------------------------------------
    const handleLargeDelete = (
        e: React.KeyboardEvent<HTMLTextAreaElement>,
        field: "bio" | "about"
    ) => {
        if (e.key === "Delete" || e.key === "Backspace") {
            const target = e.currentTarget;
            const selectionLength = Math.abs(target.selectionEnd - target.selectionStart);
            
            // Haddii la doortay in ka badan 20 xaraf (sida Select All ama 4000 xaraf)
            if (selectionLength > 20) {
                e.preventDefault(); // Ka jooji culayska browser-ka
                const start = Math.min(target.selectionStart, target.selectionEnd);
                const end = Math.max(target.selectionStart, target.selectionEnd);
                const val = target.value;
                const nextVal = val.slice(0, start) + val.slice(end);
                
                // Hal millisecond ku tirtir
                setFormData((prev) => ({ ...prev, [field]: nextVal }));
            }
        }
    };

    const handleSafePaste = (
        e: React.ClipboardEvent<HTMLTextAreaElement>,
        field: "bio" | "about",
        limit: number
    ) => {
        e.preventDefault();
        const pasteText = e.clipboardData.getData("text") || "";
        const target = e.currentTarget;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const currentVal = target.value;
        const combined = currentVal.slice(0, start) + pasteText + currentVal.slice(end);
        const finalVal = combined.slice(0, limit);
        setFormData((prev) => ({ ...prev, [field]: finalVal }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.name.trim()) {
            toast.error("Fadlan geli magaca ganacsigaaga.");
            return;
        }

        if (formData.city_ids.length === 0) {
            toast.error("Fadlan dooro ugu yaraan hal magaalo.");
            return;
        }

        startTransition(async () => {
            const res = await updateStoreGeneralAction({
                name: (formData.name || "").trim(),
                whatsapp_number: (formData.whatsapp_number || "").trim(),
                city_ids: formData.city_ids,
                category_id: formData.category_id || "",
                location: (formData.location || "").trim(),
                bio: (formData.bio || "").trim(),
                about: (formData.about || "").trim(),
            });

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(res.message || "Xogta si guul leh ayaa loo kaydiyay!");
                setIsEditing(false);
            }
        });
    };

    const selectedCategoryName = getCategoryName(formData.category_id);

    return (
        <Card className="border-border shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                <div>
                    <CardTitle className="text-lg font-bold">Macluumaadka Ganacsiga</CardTitle>
                    <CardDescription>
                        Faahfaahinta xiriirka iyo sharraxaadda guud ee ganacsigaaga.
                    </CardDescription>
                </div>
                {!isEditing ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="gap-1.5 text-xs font-semibold"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        Wax ka beddel
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        className="gap-1 text-xs text-muted-foreground"
                    >
                        <X className="w-3.5 h-3.5" />
                        Ka noqo
                    </Button>
                )}
            </CardHeader>

            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email (Locked) */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">Email-ka Akoonka</Label>
                            <Badge variant="secondary" className="gap-1 text-[10px] font-normal py-0">
                                <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                                Lama beddeli karo
                            </Badge>
                        </div>
                        <Input
                            value={userEmail}
                            disabled
                            className="bg-muted/40 text-muted-foreground cursor-not-allowed"
                        />
                    </div>

                    {/* Magaca Ganacsiga */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Magaca Ganacsiga *</Label>
                        {isEditing ? (
                            <Input
                                value={formData.name || ""}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Tusaale: Hilaac Store"
                            />
                        ) : (
                            <div className="p-2.5 rounded-lg border bg-muted/20 text-sm font-semibold text-foreground">
                                {formData.name || "Lama gelin"}
                            </div>
                        )}
                    </div>

                    {/* Qaybta (Category) */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Qaybta Ganacsiga</Label>
                        {isEditing ? (
                            <Select
                                value={formData.category_id ? formData.category_id : undefined}
                                onValueChange={(val: string | null) =>
                                    setFormData({ ...formData, category_id: val || "" })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Dooro Qaybta">
                                        {selectedCategoryName !== "Lama dooran" ? selectedCategoryName : "Dooro Qaybta"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="p-2.5 rounded-lg border bg-muted/20 text-sm flex items-center gap-2">
                                <Tag className="w-4 h-4 text-primary" />
                                <span className="font-medium text-foreground">{selectedCategoryName}</span>
                            </div>
                        )}
                    </div>

                    {/* Magaalooyinka */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Magaalooyinka aad ka hawlgasho *</Label>
                            {isEditing && (
                                <span className="text-[11px] text-primary font-medium">
                                    (Dooro dhammaan magaalooyinka aad gaarsiin karto)
                                </span>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {cities.map((city) => {
                                    const isSelected = formData.city_ids.includes(city.id);
                                    return (
                                        <button
                                            key={city.id}
                                            type="button"
                                            onClick={() => toggleCity(city.id)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer select-none ${
                                                isSelected
                                                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                                    : "bg-muted/40 text-foreground border-border/70 hover:bg-muted"
                                            }`}
                                        >
                                            <MapPin className={`h-3 w-3 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                            <span>{city.name}</span>
                                            {isSelected && <Check className="h-3.5 w-3.5 ml-0.5" />}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-2.5 rounded-lg border bg-muted/20 min-h-11 flex flex-wrap items-center gap-1.5">
                                {formData.city_ids.length > 0 ? (
                                    formData.city_ids.map((id) => (
                                        <span
                                            key={id}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 text-xs font-semibold"
                                        >
                                            <MapPin className="w-3 h-3" />
                                            {getCityName(id)}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-muted-foreground italic">Magaalo lama dooran</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* WhatsApp & Goobta Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">WhatsApp Dalabka</Label>
                            {isEditing ? (
                                <Input
                                    value={formData.whatsapp_number || ""}
                                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                    required
                                    placeholder="25261XXXXXXX"
                                />
                            ) : (
                                <div className="p-2.5 rounded-lg border bg-muted/20 text-sm flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-emerald-600" />
                                    <span className="font-medium text-foreground">{formData.whatsapp_number || "Lama gelin"}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Goobta Ganacsiga (Degmada / Laamiga)</Label>
                            {isEditing ? (
                                <Input
                                    value={formData.location || ""}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Tusaale: Suuqa Bakaaraha, Laamiga 1-aad"
                                />
                            ) : (
                                <div className="p-2.5 rounded-lg border bg-muted/20 text-sm">
                                    {formData.location || "Lama qeexin"}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 1. Bio (Max 160) - SAFE DRAG & DELETE */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label className="text-xs font-medium">Bio-ga Ganacsiga (Qoraal Kooban)</Label>
                                {isEditing && formData.bio && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, bio: "" })}
                                        className="text-[10px] text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                                    >
                                        <Eraser className="h-3 w-3" /> Tirtir qoraalka
                                    </button>
                                )}
                            </div>
                            <span className="text-[11px] text-muted-foreground font-mono">
                                {(formData.bio || "").length}/160
                            </span>
                        </div>
                        {isEditing ? (
                            <Textarea
                                maxLength={160}
                                rows={2}
                                value={formData.bio || ""}
                                onKeyDown={(e) => handleLargeDelete(e, "bio")}
                                onPaste={(e) => handleSafePaste(e, "bio", 160)}
                                onChange={(e) =>
                                    setFormData({ ...formData, bio: e.target.value.slice(0, 160) })
                                }
                                placeholder="Hal-ku-dhig kooban (tusaale: Ganaciga dharka iyo kabaha casriga ah)..."
                                className="resize-none"
                            />
                        ) : (
                            <div className="p-3 rounded-lg border bg-muted/20 text-sm italic text-foreground min-h-12.5">
                                {formData.bio || "Weli wax bio ah lama qorin."}
                            </div>
                        )}
                    </div>

                    {/* 2. About Us (Max 1000) - SAFE DRAG & DELETE */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label className="text-xs font-medium">Bogga Nagu Saabsan (About Us)</Label>
                                {isEditing && formData.about && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, about: "" })}
                                        className="text-[10px] text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                                    >
                                        <Eraser className="h-3 w-3" /> Tirtir qoraalka
                                    </button>
                                )}
                            </div>
                            <span className="text-[11px] text-muted-foreground font-mono">
                                {(formData.about || "").length}/1000
                            </span>
                        </div>
                        {isEditing ? (
                            <Textarea
                                maxLength={1000}
                                rows={4}
                                value={formData.about || ""}
                                onKeyDown={(e) => handleLargeDelete(e, "about")}
                                onPaste={(e) => handleSafePaste(e, "about", 1000)}
                                onChange={(e) =>
                                    setFormData({ ...formData, about: e.target.value.slice(0, 1000) })
                                }
                                placeholder="Halkan ku qor sheekada ganacsigaaga, waxaad qabataan, iyo sababta macaamiishu idiin dooranayaan..."
                                className="resize-none"
                            />
                        ) : (
                            <div className="p-3 rounded-lg border bg-muted/20 text-sm whitespace-pre-line text-foreground min-h-20">
                                {formData.about || "Weli wax macluumaad ah laguma qorin bogga 'Nagu Saabsan'."}
                            </div>
                        )}
                    </div>

                    {/* Save Buttons */}
                    {isEditing && (
                        <div className="flex justify-end gap-2 pt-3 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                            >
                                Ka noqo
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="gap-2 bg-primary text-primary-foreground font-semibold"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Keydi Isbeddelka
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}