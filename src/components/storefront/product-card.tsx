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
    // Xaaladda faahfaahinta: Bilowga waa xiran tahay (false)
    const [showDescription, setShowDescription] = useState(false);

    const hasOptions = Array.isArray(product.options) && product.options.length > 0;
    const hasDescription = Boolean(product.description && product.description.trim().length > 0);

    return (
        <div className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
            {/* 1. Sawirka & Stock Badge */}
            <div className="relative aspect-square w-full bg-muted overflow-hidden">
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
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground/40">
                        <Package className="h-10 w-10" />
                    </div>
                )}

                {/* Badge-ka Stock-ga */}
                <div className="absolute top-2.5 left-2.5">
                    {!product.in_stock ? (
                        <Badge variant="destructive" className="text-[11px] font-semibold px-2 py-0.5 shadow-sm">
                            Waa Dhammaaday
                        </Badge>
                    ) : hasOptions ? (
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-xs text-[10px] text-foreground font-medium px-2 py-0.5 shadow-xs flex items-center gap-1">
                            <Layers className="h-3 w-3 text-primary" />
                            Xulasho leh
                        </Badge>
                    ) : null}
                </div>
            </div>

            {/* 2. Macluumaadka Sheyga */}
            <div className="p-3.5 flex flex-col justify-between flex-1 gap-3">
                <div className="space-y-2">
                    {/* Magaca & Qiimaha */}
                    <div>
                        <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-base font-black text-emerald-600 mt-0.5">
                            ${Number(product.price).toFixed(2)}
                        </p>
                    </div>

                    {/* 3. Xulashooyinka la Doortay (Options/Presets Pills) */}
                    {hasOptions && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {product.options!.map((opt: ProductOption) => (
                                <div
                                    key={opt.name}
                                    className="inline-flex items-center text-[10px] bg-muted/60 text-foreground/90 border border-border/70 rounded-md px-2 py-0.5 font-medium"
                                >
                                    <span className="text-muted-foreground mr-1">{opt.name}:</span>
                                    <span className="font-semibold text-primary">{opt.values.join(", ")}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 4. Qaybta Faahfaahinta (Arag / Qari Accordion) */}
                    {hasDescription && (
                        <div className="pt-1 border-t border-border/40">
                            <button
                                type="button"
                                onClick={() => setShowDescription(!showDescription)}
                                className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer select-none"
                            >
                                <span>{showDescription ? "Qari Faahfaahinta" : "Arag Faahfaahinta"}</span>
                                {showDescription ? (
                                    <ChevronUp className="h-3 w-3" />
                                ) : (
                                    <ChevronDown className="h-3 w-3" />
                                )}
                            </button>

                            {/* Qoraalka Faahfaahinta oo furmaya */}
                            {showDescription && (
                                <p className="text-xs text-muted-foreground mt-1.5 bg-muted/30 p-2.5 rounded-xl border border-border/60 leading-relaxed whitespace-pre-wrap animate-in fade-in-50 duration-200">
                                    {product.description}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* 5. Badhanka Ficilka (WhatsApp Order / Contact) */}
                <div className="pt-1">
                    {product.in_stock ? (
                        <Button
                            size="sm"
                            onClick={() => onOrder(product)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-9 rounded-xl shadow-xs cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <MessageCircle className="h-3.5 w-3.5" />
                            Dalbo / La Xiriir
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            disabled
                            variant="outline"
                            className="w-full text-xs text-muted-foreground gap-1.5 h-9 rounded-xl border-dashed cursor-not-allowed bg-muted/40"
                        >
                            <Ban className="h-3.5 w-3.5 text-destructive" />
                            Waa Dhammaaday
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}