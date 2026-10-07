"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Zap, AlertCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, ProductsResponse } from "./types";
import { ProductsTable } from "./product-table";
import { ProductDialog } from "./product-dialog";
import { DeleteProductDialog } from "./delete-dialog";
import { ProductsPagination } from "./product-pagination";

interface ProductsViewProps {
    initialData: ProductsResponse;
    maxLimit?: number; // Xadka qorshaha dukaanka (tusaale 15, 50, 150)
    categoryName?: string; // Magaca category-ga dukaanka
}

export function ProductsView({
    initialData,
    maxLimit = 15,
    categoryName
}: ProductsViewProps) {
    const [productDialog, setProductDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Xisaabi xadka
    const currentCount = initialData.totalCount;

    // Haddii maxLimit uu yahay 0, macnaheedu waa qorshe ma haysto!
    const hasNoPlan = maxLimit === 0;
    const isLimitReached = hasNoPlan || currentCount >= maxLimit;
    const remaining = Math.max(0, maxLimit - currentCount);

    const handleOpenCreate = () => {
        setSelectedProduct(null);
        setProductDialog(true);
    };

    const handleOpenEdit = (p: Product) => {
        setSelectedProduct(p);
        setProductDialog(true);
    };

    const handleOpenDelete = (p: Product) => {
        setSelectedProduct(p);
        setDeleteDialog(true);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Bandhigga Ganacsiga
                        </h1>
                        <Badge
                            variant="outline"
                            className={
                                isLimitReached
                                    ? "border-destructive text-destructive bg-destructive/5 font-semibold"
                                    : "border-primary/40 text-primary bg-primary/5 font-semibold"
                            }
                        >
                           {hasNoPlan ? "Xirmo Ma Haysatid" : `${currentCount} / ${maxLimit} Boos`}
                        </Badge>
                    </div>

                    {/* Farriinta Qoraalka ah */}
                    <p className="text-muted-foreground text-sm mt-1">
                        {hasNoPlan ? (
                            <span className="text-destructive font-medium flex items-center gap-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                               Ma haysatid xirmo shaqaynaysa. Fadlan qaado xirmo si aad wax u soo geliso.
                            </span>
                        ) : isLimitReached ? (
                            <span className="text-destructive font-medium flex items-center gap-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span className="text-destructive font-medium flex items-center gap-1">
    <AlertCircle className="h-3.5 w-3.5" />
    Waxaad buuxisay xadkii xirmadaada ({maxLimit}/{maxLimit}). Kordhi xirmada si aad wax kale ugu darto.
</span>
                            </span>
                        ) : (
                           <span>
    Waxaa kuu furan oo aad ku dari kartaa{" "}
    <strong className="text-foreground">{remaining} boos</strong> oo dheeraad ah.
</span>
                        )}
                    </p>
                </div>

                {/* Action Button-ka */}
                <div className="flex items-center">
                    {hasNoPlan ? (
                        <Link
                            href="/store/plans"
                            className={buttonVariants({
                                className: "bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-sm self-start sm:self-auto",
                            })}
                        >
                            <Zap className="h-4 w-4 fill-current" />
                            Dooro Xirmo Hadda
                        </Link>
                    ) : isLimitReached ? (
                        <Link
                            href="/store/plans"
                            className={buttonVariants({
                                className: "bg-amber-600 hover:bg-amber-700 text-white gap-2 shadow-sm self-start sm:self-auto",
                            })}
                        >
                            <Zap className="h-4 w-4 fill-current" />
                            Xadkii waa buuxsamay (Kordhi Xirmada)
                        </Link>
                    ) : (
                        <Button
                            onClick={handleOpenCreate}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-sm self-start sm:self-auto"
                        >
                            <Plus className="h-4 w-4" />+Add New
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Table */}
            <ProductsTable
                products={initialData.products}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
            />

            {/* Pagination */}
            <ProductsPagination
                currentPage={initialData.currentPage}
                totalPages={initialData.totalPages}
            />

            {/* Product Dialog (Add / Edit) - Hadda si toos ah ayuu u helayaa Category-ga */}
            <ProductDialog
                open={productDialog}
                onOpenChange={setProductDialog}
                product={selectedProduct}
                storeCategoryName={categoryName}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteProductDialog
                open={deleteDialog}
                onOpenChange={setDeleteDialog}
                productId={selectedProduct?.id || null}
                productName={selectedProduct?.name || ""}
            />
        </div>
    );
}