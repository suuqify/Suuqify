"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadCloud, Trash2, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { updateStoreBrandingAction } from "@/actions/store/settings";
import { StoreData } from "./types";

interface BrandingTabProps {
    store: StoreData;
}

export function BrandingTab({ store }: BrandingTabProps) {
    const [logoUrl, setLogoUrl] = useState<string | null>(store.logo_url ?? null);
    const [backLogoUrl, setBackLogoUrl] = useState<string | null>(store.back_logo_url ?? null);

    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [deletingLogo, setDeletingLogo] = useState(false);
    const [deletingBanner, setDeletingBanner] = useState(false);

    // 1. Soo gelinta Logo-da
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Sawirku waa inuu ka yaraadaa 5MB.");
            return;
        }

        setUploadingLogo(true);
        try {
            const supabase = await createClient();
            const ext = file.name.split(".").pop();
            const fileName = `logo-${store.id}-${Date.now()}.${ext}`;
            const filePath = `branding/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("stores")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("stores").getPublicUrl(filePath);

            const res = await updateStoreBrandingAction({ logo_url: data.publicUrl });
            if (res.error) {
                toast.error(res.error);
            } else {
                setLogoUrl(data.publicUrl);
                toast.success("Logo-da dukaanka waa la cusboonaysiiyay!");
            }
        } catch {
            toast.error("Khalad ayaa dhacay markii la soo gelinayay logo-da.");
        } finally {
            setUploadingLogo(false);
        }
    };

    // 2. Tirtirista Logo-da
    const handleDeleteLogo = async () => {
        if (!confirm("Ma hubtaa inaad rabto inaad tirtirto Logo-da ganacsigaaga?")) return;

        setDeletingLogo(true);
        try {
            const res = await updateStoreBrandingAction({ logo_url: null });
            if (res.error) {
                toast.error(res.error);
            } else {
                setLogoUrl(null);
                toast.success("Logo-da si guul leh ayaa loo tirtiray.");
            }
        } catch {
            toast.error("Khalad ayaa dhacay markii la tirtirayay logo-da.");
        } finally {
            setDeletingLogo(false);
        }
    };

    // 3. Soo gelinta Banner-ka (Cover)
    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Sawirku waa inuu ka yaraadaa 5MB.");
            return;
        }

        setUploadingBanner(true);
        try {
            const supabase = await createClient();
            const ext = file.name.split(".").pop();
            const fileName = `banner-${store.id}-${Date.now()}.${ext}`;
            const filePath = `branding/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("stores")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("stores").getPublicUrl(filePath);

            const res = await updateStoreBrandingAction({ back_logo_url: data.publicUrl });
            if (res.error) {
                toast.error(res.error);
            } else {
                setBackLogoUrl(data.publicUrl);
                toast.success("Banner-ka dukaanka waa la cusboonaysiiyay!");
            }
        } catch {
            toast.error("Khalad ayaa dhacay markii la soo gelinayay banner-ka.");
        } finally {
            setUploadingBanner(false);
        }
    };

    // 4. Tirtirista Banner-ka
    const handleDeleteBanner = async () => {
        if (!confirm("Ma hubtaa inaad rabto inaad tirtirto Banner-ka dambe ee ganacsigaaga?")) return;

        setDeletingBanner(true);
        try {
            const res = await updateStoreBrandingAction({ back_logo_url: null });
            if (res.error) {
                toast.error(res.error);
            } else {
                setBackLogoUrl(null);
                toast.success("Banner-ka dambe si guul leh ayaa loo tirtiray.");
            }
        } catch {
            toast.error("Khalad ayaa dhacay markii la tirtirayay banner-ka.");
        } finally {
            setDeletingBanner(false);
        }
    };

    return (
        <Card className="border-border shadow-xs">
            <CardHeader className="pb-4 border-b">
                <CardTitle className="text-lg font-bold">Muuqaalka & Sawirrada</CardTitle>
                <CardDescription>
                    Soo geli, wax ka beddel, ama tirtir Logo-da iyo Banner-ka dambe ee Ganacsigaaga (Ugu badnaan 5MB).
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-8">
                {/* 1. Qaybta Logo-da */}
                <div className="space-y-3">
                    <div>
                        <h4 className="text-sm font-semibold text-foreground">Logo-da Ganacsigaaga</h4>
                        <p className="text-xs text-muted-foreground">
                            Sawir laba-jibaaran (1:1 ratio) oo cabbirkiisu yahay ugu yaraan 300x300px.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Logo Preview */}
                        <div className="relative h-24 w-24 rounded-2xl border-2 border-dashed border-border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0">
                            {logoUrl ? (
                                <Image src={logoUrl} alt="Store Logo" fill className="object-cover" />
                            ) : (
                                <span className="text-2xl font-black text-primary/40 uppercase">
                                    {store.name?.charAt(0) || "S"}
                                </span>
                            )}
                        </div>

                        {/* Action Buttons for Logo */}
                        <div className="flex flex-wrap items-center gap-2">
                            <label className="cursor-pointer">
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-colors">
                                    {uploadingLogo ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <UploadCloud className="h-3.5 w-3.5" />
                                    )}
                                    <span>{logoUrl ? "Beddel Logo-da" : "Soo geli Logo"}</span>
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadingLogo || deletingLogo}
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                            </label>

                            {/* Badhanka Tirtirka Logo-da (Kaliya marka logo jirto) */}
                            {logoUrl && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDeleteLogo}
                                    disabled={uploadingLogo || deletingLogo}
                                    className="h-9 px-3 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl gap-1.5"
                                >
                                    {deletingLogo ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                    )}
                                    <span>Tirtir</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-border/60 w-full" />

                {/* 2. Qaybta Banner-ka (Cover) */}
                <div className="space-y-3">
                    <div>
                        <h4 className="text-sm font-semibold text-foreground">Banner-ka Dhabarka (Cover)</h4>
                        <p className="text-xs text-muted-foreground">
                            Sawirka ballaaran ee ka muuqda dhabarka sare ee Ganacsigaaga (Cabbirka lagu taliyay: 1200x400px).
                        </p>
                    </div>

                    <div className="space-y-3">
                        {/* Banner Preview */}
                        <div className="relative h-36 w-full rounded-2xl border-2 border-dashed border-border bg-muted/30 overflow-hidden flex items-center justify-center">
                            {backLogoUrl ? (
                                <Image src={backLogoUrl} alt="Store Banner" fill className="object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-muted-foreground/40 gap-1">
                                    <ImageIcon className="h-8 w-8" />
                                    <span className="text-xs font-medium">Wax Banner ah lama gelin</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons for Banner */}
                        <div className="flex flex-wrap items-center gap-2">
                            <label className="cursor-pointer">
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-colors">
                                    {uploadingBanner ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <UploadCloud className="h-3.5 w-3.5" />
                                    )}
                                    <span>{backLogoUrl ? "Beddel Banner-ka" : "Soo geli Banner"}</span>
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadingBanner || deletingBanner}
                                    onChange={handleBannerUpload}
                                    className="hidden"
                                />
                            </label>

                            {/* Badhanka Tirtirka Banner-ka (Kaliya marka banner jiro) */}
                            {backLogoUrl && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDeleteBanner}
                                    disabled={uploadingBanner || deletingBanner}
                                    className="h-9 px-3 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl gap-1.5"
                                >
                                    {deletingBanner ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                    )}
                                    <span>Tirtir Banner-ka</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}