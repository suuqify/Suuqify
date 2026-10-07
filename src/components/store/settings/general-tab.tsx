"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, X, Check, Lock, MapPin, Phone, Tag, Loader2 } from "lucide-react";

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

    // Initial setup: Qaado city_ids haddii ay jiraan, haddii kalena city_id
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.city_ids.length === 0) {
            toast.error("Fadlan dooro ugu yaraan hal magaalo.");
            return;
        }

        startTransition(async () => {
            const res = await updateStoreGeneralAction(formData);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(res.message);
                setIsEditing(false);
            }
        });
    };

    const selectedCategoryName = getCategoryName(formData.category_id);

    return (
        <Card className="border-border shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                <div>
                    <CardTitle className="text-lg font-bold">Macluumaadka Ganacsigaaga</CardTitle>
                    <CardDescription>
                        Faahfaahinta iyo sharraxaadda Ganacsigaaga.
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
                        <p className="text-[11px] text-muted-foreground">
                            Email-kan wuxuu ku xiran yahay Google-kaaga, Wax ba lagama beddeli karo halkan.
                        </p>
                    </div>

                    {/* Magaca Dukaanka */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Magaca Ganacsiga</Label>
                        {isEditing ? (
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Tusaale: Hilaac Store"
                            />
                        ) : (
                            <div className="p-2.5 rounded-lg border bg-muted/20 text-sm font-semibold text-foreground">
                                {formData.name}
                            </div>
                        )}
                    </div>

                    {/* Qaybta (Category) */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Qaybta (Category)</Label>
                        {isEditing ? (
                            <Select
                                value={formData.category_id}
                                onValueChange={(val: string | null) =>
                                    setFormData({ ...formData, category_id: val || "" })
                                }
                            >
                                <SelectTrigger>
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

                    {/* Magaalooyinka (Multi-City Selection) */}
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
    <Label className="text-xs font-medium">Magaalooyinka aad ka Hawlgasho</Label>
    {isEditing && (
        <span className="text-[11px] text-primary font-medium">
            (Dooro magaalooyinka aad xarumaha ku leedahay ama adeeggaagu gaaro)
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
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer select-none ${isSelected
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
                                    value={formData.whatsapp_number}
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
                                    value={formData.location}
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

                    {/* Bio (Max 160) */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-medium">Faahfaahin Kooban oo Website-ka ah</Label>
                            <span className="text-[11px] text-muted-foreground font-mono">
                                {formData.bio.length}/160
                            </span>
                        </div>
                        {isEditing ? (
                            <Textarea
                                maxLength={160}
                                rows={2}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Qoraal gaaban oo Ganacsigaaga ku saabsan (max 160 xaraf)..."
                            />
                        ) : (
                            <div className="p-3 rounded-lg border bg-muted/20 text-sm italic text-foreground min-h-50px">
                                {formData.bio || "Wali wax bio ah ma aadan qorin."}
                            </div>
                        )}
                    </div>

                    {/* About (Max 1000) */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-medium">Faahfaahinta Ganacsiga (About Us)</Label>
                            <span className="text-[11px] text-muted-foreground font-mono">
                                {formData.about.length}/1000
                            </span>
                        </div>
                        {isEditing ? (
                            <Textarea
                                maxLength={1000}
                                rows={4}
                                value={formData.about}
                                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                placeholder="Faahfaahin dheer oo ku saabsan Ganacsigaaga..."
                            />
                        ) : (
                            <div className="p-3 rounded-lg border bg-muted/20 text-sm whitespace-pre-line text-foreground min-h-80px">
                                {formData.about || "Wali wax faahfaahin ah ma aadan qorin."}
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
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