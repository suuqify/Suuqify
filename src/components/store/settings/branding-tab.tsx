"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateStoreBrandingAction } from "@/actions/store/settings";
import { StoreData } from "./types";

interface BrandingTabProps {
    store: StoreData;
}

export function BrandingTab({ store }: BrandingTabProps) {
    const supabase = createClient();
    const [logoUrl, setLogoUrl] = useState<string | null>(store.logo_url);
    const [bannerUrl, setBannerUrl] = useState<string | null>(store.back_logo_url);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "banner") => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Cabbirka sawirku kama badnaan karo 5MB");
            return;
        }

        const setUploading = type === "logo" ? setUploadingLogo : setUploadingBanner;
        setUploading(true);
        const toastId = toast.loading(`Sawirka ${type === "logo" ? "Logo-da" : "Banner-ka"} baa la soo gelinayaa...`);

        try {
            const ext = file.name.split(".").pop();
            const fileName = `${store.id}/${type}-${Date.now()}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("stores")
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("stores")
                .getPublicUrl(fileName);

            const res = await updateStoreBrandingAction({
                [type === "logo" ? "logo_url" : "back_logo_url"]: publicUrl,
            });

            if (res.error) throw new Error(res.error);

            if (type === "logo") setLogoUrl(publicUrl);
            if (type === "banner") setBannerUrl(publicUrl);

            toast.success(res.message, { id: toastId });
        } catch (err: any) {
            toast.error(err.message || "Khalad ayaa dhacay sawirka soo gelintiisa", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="border-border shadow-xs">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Muuqaalka & Sawirrada</CardTitle>
                <CardDescription>
                    Soo geli Logo-da iyo Banner-ka dambe ee Ganacsigaaga (Ugu badnaan 5MB).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Logo Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-xl border bg-muted/10">
                    <Avatar className="w-20 h-20 border-2 border-primary/20 shadow-sm">
                        <AvatarImage src={logoUrl || ""} alt="Logo" className="object-cover" />
                        <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                            {store.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-bold text-foreground">Logo-da Ganacsigaaga</h4>
                        <p className="text-xs text-muted-foreground">
                            Sawir laba-jibaaran (1:1 ratio) oo cabbirkiisu yahay ugu yaraan 300x300px.
                        </p>
                        <div className="pt-2">
                            <label className="cursor-pointer inline-flex">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingLogo}
                                    onChange={(e) => handleFileUpload(e, "logo")}
                                />
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input bg-background hover:bg-muted text-xs font-semibold shadow-xs transition-colors">
                                    {uploadingLogo ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                                    ) : (
                                        <UploadCloud className="w-3.5 h-3.5 text-primary" />
                                    )}
                                    Beddel Logo-da
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Banner Section */}
                <div className="space-y-3 p-4 rounded-xl border bg-muted/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-foreground">Banner-ka Dhabarka (Cover)</h4>
                            <p className="text-xs text-muted-foreground">
                                Sawirka ballaaran ee ka muuqda dhabarka sare ee Ganacsigaaga.
                            </p>
                        </div>
                        <label className="cursor-pointer inline-flex">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingBanner}
                                onChange={(e) => handleFileUpload(e, "banner")}
                            />
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input bg-background hover:bg-muted text-xs font-semibold shadow-xs transition-colors">
                                {uploadingBanner ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                                ) : (
                                    <UploadCloud className="w-3.5 h-3.5 text-primary" />
                                )}
                                Soo geli Banner
                            </span>
                        </label>
                    </div>

                    <div className="w-full h-36 md:h-48 rounded-lg border bg-muted/30 overflow-hidden relative flex items-center justify-center">
                        {bannerUrl ? (
                            <img src={bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center text-muted-foreground flex flex-col items-center gap-1">
                                <ImageIcon className="w-8 h-8 stroke-1 text-muted-foreground/60" />
                                <span className="text-xs">Wali wax banner ah ma aadan soo gelin</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}