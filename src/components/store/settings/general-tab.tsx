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
    city_id: string;
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

    const [formData, setFormData] = useState<GeneralFormData>({
        name: store.name ?? "",
        whatsapp_number: store.whatsapp_number ?? "",
        city_id: store.city_id ?? "",
        category_id: store.category_id ?? "",
        location: store.location ?? "",
        bio: store.bio ?? "",
        about: store.about ?? "",
    });

    // Helpers lagu helayo Magaca (Name) halkii ID la arki lahaa
    const getCityName = (idOrName: string) => {
        if (!idOrName) return "Lama dooran";
        const found = cities.find(
            (c) => c.id === idOrName || c.name.toLowerCase() === idOrName.toLowerCase()
        );
        return found ? found.name : "Lama dooran";
    };

    const getCategoryName = (idOrName: string) => {
        if (!idOrName) return "Lama dooran";
        const found = categories.find(
            (c) => c.id === idOrName || c.name.toLowerCase() === idOrName.toLowerCase()
        );
        return found ? found.name : "Lama dooran";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
    const selectedCityName = getCityName(formData.city_id);

    return (
        <Card className="border-border shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                <div>
                    <CardTitle className="text-lg font-bold">Macluumaadka Dukaanka</CardTitle>
                    <CardDescription>
                        Faahfaahinta xiriirka iyo sharraxaadda dukaankaaga.
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
                            Email-kan wuxuu ku xiran yahay Google-kaaga, lagama beddeli karo halkan.
                        </p>
                    </div>

                    {/* Magaca Dukaanka */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Magaca Dukaanka</Label>
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

                    {/* Qaybta & Magaalada Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category */}
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

                        {/* City */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Magaalada</Label>
                            {isEditing ? (
                                <Select
                                    value={formData.city_id}
                                    onValueChange={(val: string | null) =>
                                        setFormData({ ...formData, city_id: val || "" })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Dooro Magaalada">
                                            {selectedCityName !== "Lama dooran" ? selectedCityName : "Dooro Magaalada"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((city) => (
                                            <SelectItem key={city.id} value={city.id}>
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="p-2.5 rounded-lg border bg-muted/20 text-sm flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-foreground">{selectedCityName}</span>
                                </div>
                            )}
                        </div>
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
                            <Label className="text-xs font-medium">Goobta Dukaanka (Location)</Label>
                            {isEditing ? (
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Tusaale: Suuqa Bakaaraha, Muqdisho"
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
                            <Label className="text-xs font-medium">Bio Kooban (Link-in-Bio)</Label>
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
                                placeholder="Qoraal gaaban oo dukaankaaga ku saabsan (max 160 xaraf)..."
                            />
                        ) : (
                            <div className="p-3 rounded-lg border bg-muted/20 text-sm italic text-foreground min-h-12.5">
                                {formData.bio || "Wali wax bio ah ma aadan qorin."}
                            </div>
                        )}
                    </div>

                    {/* About (Max 1000) */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-medium">Faahfaahinta Dukaanka (About Us)</Label>
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
                                placeholder="Faahfaahin dheer oo ku saabsan dukaankaaga..."
                            />
                        ) : (
                            <div className="p-3 rounded-lg border bg-muted/20 text-sm whitespace-pre-line text-foreground min-h-20">
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