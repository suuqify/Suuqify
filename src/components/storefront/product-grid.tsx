// src/components/storefront/product-grid.tsx
"use client";

import { PackageOpen } from "lucide-react";
import { StorefrontProduct } from "./types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
    products: StorefrontProduct[];
    onOrder: (product: StorefrontProduct) => void;
}

export function ProductGrid({ products, onOrder }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="py-16 text-center space-y-3 bg-muted/20 rounded-2xl border border-dashed my-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <PackageOpen className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">Weli waxba lama soo bandhigin</h3>
<p className="text-xs text-muted-foreground max-w-xs mx-auto">
    Dhowaan ayaa halkan lagu soo kordhin doonaa waxyaabo cusub. Fadlan dib ugu soo laabo mar kale.
</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 my-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onOrder={onOrder} />
            ))}
        </div>
    );
}