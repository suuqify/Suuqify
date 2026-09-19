"use client";

import { useState } from "react";
import { Product, ProductsResponse } from "./types";
import { ProductsTable } from "./product-table";
import { ProductDialog } from "./product-dialog";
import { DeleteProductDialog } from "./delete-dialog";
import { ProductsPagination } from "./product-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductsViewProps {
    initialData: ProductsResponse;
}

export function ProductsView({ initialData }: ProductsViewProps) {
    const [productDialog, setProductDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
        <div className="space-y-6">
            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Alaabta Dukaanka</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Maamul alaabtaada, qiimaha, iyo kala-doorashooyinka kala duwan.
                    </p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-1.5 shadow-sm">
                    <Plus className="h-4 w-4" /> Ku dar Alaab Cusub
                </Button>
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

            {/* Product Dialog (Add / Edit) */}
            <ProductDialog
                open={productDialog}
                onOpenChange={setProductDialog}
                product={selectedProduct}
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