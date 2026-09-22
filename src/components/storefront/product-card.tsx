"use client";

import Image from "next/image";
import { MessageCircle, Package, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StorefrontProduct } from "./types";

interface ProductCardProps {
    product: StorefrontProduct;
    onOrder: (product: StorefrontProduct) => void;
}

export function ProductCard({ product, onOrder }: ProductCardProps) {
    return (
        <div className="group flex flex-col justify-between rounded-2xl border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
            {/* Sawirka & Stock Badge */}
            <div className="relative aspect-square w-full bg-muted overflow-hidden">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${!product.in_stock ? "grayscale opacity-60" : ""
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
                            Waa Dhamaatay
                        </Badge>
                    ) : (
                        product.options && product.options.length > 0 && (
                            <Badge variant="secondary" className="bg-background/90 backdrop-blur-xs text-[10px] text-foreground font-medium px-2 py-0.5 shadow-xs">
                                Kala-doorasho leh
                            </Badge>
                        )
                    )}
                </div>
            </div>

            {/* Faahfaahinta Alaabta */}
            <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5">
                <div>
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-base font-black text-emerald-600 mt-0.5">
                        ${Number(product.price).toFixed(2)}
                    </p>
                </div>

                {/* Badhanka Dalabka */}
                {product.in_stock ? (
                    <Button
                        size="sm"
                        onClick={() => onOrder(product)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-9 rounded-xl shadow-xs"
                    >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Dalbo Hadda
                    </Button>
                ) : (
                    <Button
                        size="sm"
                        disabled
                        variant="outline"
                        className="w-full text-xs text-muted-foreground gap-1.5 h-9 rounded-xl border-dashed cursor-not-allowed bg-muted/40"
                    >
                        <Ban className="h-3.5 w-3.5 text-destructive" />
                        Waa Dhamaatay
                    </Button>
                )}
            </div>
        </div>
    );
}