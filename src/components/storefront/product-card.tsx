"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, Package, Ban, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StorefrontProduct, ProductOption } from "./types";

interface ProductCardProps {
    product: StorefrontProduct;
    onOrder: (product: StorefrontProduct) => void;
}

export function ProductCard({ product, onOrder }: ProductCardProps) {
    const [showDescription, setShowDescription] = useState(false);

    let optionsList: ProductOption[] = [];
    if (Array.isArray(product.options)) {
        optionsList = product.options;
    } else if (typeof product.options === "string") {
        try {
            const parsed = JSON.parse(product.options);
            if (Array.isArray(parsed)) optionsList = parsed;
        } catch {
            optionsList = [];
        }
    }

    const hasOptions = optionsList.length > 0;
    const hasDescription = Boolean(product.description && product.description.trim().length > 0);

    return (
        <div className="group flex flex-col h-full rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all">
            {/* Sawirka */}
            <div className="relative aspect-square w-full bg-muted overflow-hidden shrink-0">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                            !product.in_stock ? "grayscale opacity-60" : ""
                        }`}
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground/30">
                        <Package className="h-10 w-10" />
                    </div>
                )}

                {/* Badges */}
                 {!product.in_stock && (
                    <div className="absolute top-2 left-2">
                        <Badge variant="destructive" className="text-[10px] font-bold px-2 py-0.5 tracking-tight shadow-sm">
                            Lama heli karo
                        </Badge>
                    </div>
                )}
            </div>

            {/* Xogta Card-ka */}
            <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
                <div className="space-y-1.5">
                    {/* Magaca iyo Qiimaha */}
                    <div>
                        <h3 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-sm sm:text-base font-black text-emerald-600 mt-0.5">
                            ${Number(product.price).toFixed(2)}
                        </p>
                    </div>

                    {/* Options (Haddii ay jiraan) */}
                    {hasOptions && (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {optionsList.map((opt) => (
                                <span
                                    key={opt.name}
                                    className="inline-flex items-center text-[10px] bg-muted/60 text-foreground border border-border/60 rounded-md px-1.5 py-0.5"
                                >
                                    <span className="text-muted-foreground mr-1">{opt.name}:</span>
                                    <span className="font-semibold text-primary">{opt.values.join(", ")}</span>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Faahfaahinta */}
                    {hasDescription && (
                        <div className="pt-1 border-t border-border/50">
                            <button
                                type="button"
                                onClick={() => setShowDescription(!showDescription)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer select-none"
                            >
                                <span>{showDescription ? "Qari faahfaahinta" : "Faahfaahin dheeraad ah"}</span>
                                {showDescription ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>

                            {showDescription && (
                                <p className="text-[11px] text-muted-foreground mt-1 bg-muted/30 p-2 rounded-lg border border-border/60 leading-relaxed whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Badhanka Hoose */}
                <div className="pt-2 mt-auto">
                    {product.in_stock ? (
                        <Button
                            size="sm"
                            onClick={() => onOrder(product)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-8.5 rounded-xl shadow-xs cursor-pointer active:scale-98"
                        >
                            <MessageCircle className="h-3.5 w-3.5" />
                            Dalbo / La Xiriir
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            disabled
                            variant="outline"
                            className="w-full text-xs text-muted-foreground gap-1.5 h-8.5 rounded-xl border-dashed cursor-not-allowed bg-muted/40"
                        >
                            <Ban className="h-3.5 w-3.5 text-destructive" />
                            Hadda lama heli karo
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}