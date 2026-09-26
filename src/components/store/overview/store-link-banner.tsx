"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Copy, Check, ExternalLink, Sparkles, Share2 } from "lucide-react";
import { toast } from "sonner";

interface StoreLinkBannerProps {
    storeName: string;
    isVerified: boolean;
}

export function StoreLinkBanner({ storeName, isVerified }: StoreLinkBannerProps) {
    const [copied, setCopied] = useState(false);

    // Link-ga storefront-ka dhabta ah
    const storeUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/${encodeURIComponent(storeName)}`
            : `suuqify.com/${storeName}`;

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(storeUrl);
            setCopied(true);
            toast.success("Link-ga dukaanka waa la koobiyeeyay!");
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-sm">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-xs border border-white/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Link-in-Bio Micro-Storefront</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {storeName}
                        </h1>
                        {isVerified && (
                            <BadgeCheck className="w-6 h-6 text-white fill-emerald-500 shrink-0" />
                        )}
                    </div>

                    <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                        Kani waa link-ga dukaankaaga! Ku dhaji <strong>Bio-gaaga TikTok ama Instagram</strong> si macaamiishu toos ugu soo dalbadaan alaabtaada WhatsApp.
                    </p>
                </div>

                {/* Action Box: Copy Link & Open Store */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-black/20 p-2 rounded-2xl border border-white/15 backdrop-blur-md">
                    <div className="px-3.5 py-2 text-xs font-mono font-medium text-emerald-100 truncate max-w-xs select-all">
                        {storeUrl}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleCopyLink}
                            size="sm"
                            className="flex-1 sm:flex-initial h-9 rounded-xl text-xs font-semibold bg-white text-emerald-900 hover:bg-emerald-50 gap-1.5 shadow-xs transition-all"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Waa La Koobiyey!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Koobiye Link</span>
                                </>
                            )}
                        </Button>

                        <Link
                            href={`/${encodeURIComponent(storeName)}`}
                            target="_blank"
                            className="inline-flex items-center justify-center h-9 px-3.5 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 text-white gap-1.5 border border-white/20 transition-all"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Fur Dukaanka</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}