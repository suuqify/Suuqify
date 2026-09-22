import Image from "next/image";
import { CheckCircle2, MapPin, Tag, MessageCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StorefrontHeaderProps {
    name: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    bio: string | null;
    isVerified: boolean;
    cityName?: string | null;
    categoryName?: string | null;
    whatsappNumber: string;
}

export function StorefrontHeader({
    name,
    logoUrl,
    bannerUrl,
    bio,
    isVerified,
    cityName,
    categoryName,
    whatsappNumber,
}: StorefrontHeaderProps) {
    let cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) cleanPhone = "252" + cleanPhone.substring(1);
    else if (!cleanPhone.startsWith("252") && cleanPhone.length === 9) cleanPhone = "252" + cleanPhone;

    return (
        <div className="relative bg-card border-b">
            {/* Banner */}
            <div className="relative h-32 sm:h-44 md:h-52 w-full bg-linear-to-r from-emerald-600/20 to-teal-500/10 overflow-hidden mb-4">
                {bannerUrl ? (
                    <Image src={bannerUrl} alt="Store Banner" fill className="object-cover" priority />
                ) : (
                    <div className="w-full h-full bg-muted/40" />
                )}
            </div>

            {/* Info Container */}
            <div className="max-w-4xl mx-auto px-4 pb-6">
                <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
                    {/* Logo & Magaca */}
                    <div className="flex items-end gap-3.5">
                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-card border-4 border-card shadow-md overflow-hidden shrink-0">
                            {logoUrl ? (
                                <Image src={logoUrl} alt={name} fill className="object-cover" priority />
                            ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground/60">
                                    <Store className="h-10 w-10" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                                    {name}
                                </h1>
                                {isVerified && (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                                )}
                            </div>

                            {/* Tags: City & Category */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                {cityName && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-primary" /> {cityName}
                                    </span>
                                )}
                                {categoryName && (
                                    <span className="flex items-center gap-1">
                                        <Tag className="h-3 w-3 text-primary" /> {categoryName}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Badhanka Guud ee WhatsApp */}
                    <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Asc ${name}, waxaan kaaga soo xiriiray storefront-kaaga Suuqify.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 sm:mt-0"
                    >
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2.5 h-auto flex items-center gap-2 font-semibold shadow-xs transition-all cursor-pointer"
                        >
                            <MessageCircle className="h-4 w-4 shrink-0 fill-current/20" />
                            <span className="whitespace-nowrap text-sm">La Xiriir Dukaanka</span>
                        </Button>
                    </a>
                </div>

                {/* Bio-ga Dukaanka (Max 160) */}
                {bio && (
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                        {bio}
                    </p>
                )}
            </div>
        </div>
    );
}