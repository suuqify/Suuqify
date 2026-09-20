"use client";

import { useState } from "react";
import { Product } from "./types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toggleStockAction } from "@/actions/store/products/mutation";
import { toast } from "sonner";
import { MoreHorizontal, Edit, Trash2, Package } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductsTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleToggleStock = async (product: Product) => {
        setTogglingId(product.id);
        const res = await toggleStockAction(product.id, !product.in_stock);
        if (!res.success) {
            toast.error(res.error || "Xaaladda lama beddeli karin");
        }
        setTogglingId(null);
    };

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-xl border border-dashed">
                <Package className="h-10 w-10 text-muted-foreground/60 mb-3" />
                <h3 className="font-semibold text-base">Weli wax alaab ah ma lihid</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Guji badhanka sare si aad ugu darto alaabtaadii ugu horreysay.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl border overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/40">
                        <TableRow>
                            <TableHead className="w-20">Sawir</TableHead>
                            <TableHead>Magaca</TableHead>
                            <TableHead>Qiimaha</TableHead>
                            <TableHead>Options</TableHead>
                            <TableHead>Xaaladda</TableHead>
                            <TableHead className="text-right">Wax ka qabo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <div className="relative h-12 w-12 rounded-lg bg-muted overflow-hidden border">
                                        {p.image ? (
                                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                                        ) : (
                                            <Package className="h-6 w-6 text-muted-foreground/40 m-auto mt-3" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                                <TableCell className="font-semibold text-emerald-600">
                                    ${p.price.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    {p.options && p.options.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {p.options.map((opt, i) => (
                                                <Badge key={i} variant="secondary" className="text-[11px]">
                                                    {opt.name}: {opt.values.length}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">Kala-doorasho maleh</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={p.in_stock}
                                            disabled={togglingId === p.id}
                                            onCheckedChange={() => handleToggleStock(p)}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {p.in_stock ? "Diyaar" : "Dhamaaday"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            className={cn(
                                                buttonVariants({ variant: "ghost", size: "icon" }),
                                                "h-8 w-8 cursor-pointer"
                                            )}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(p)}>
                                                <Edit className="h-4 w-4 mr-2" /> Wax ka beddel
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onDelete(p)}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" /> Tirtir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card List */}
            <div className="divide-y md:hidden">
                {products.map((p) => (
                    <div key={p.id} className="p-4 flex items-center gap-3">
                        <div className="relative h-16 w-16 rounded-lg bg-muted overflow-hidden border shrink-0">
                            {p.image ? (
                                <Image src={p.image} alt={p.name} fill className="object-cover" />
                            ) : (
                                <Package className="h-6 w-6 text-muted-foreground/40 m-auto mt-5" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{p.name}</h4>
                            <p className="font-bold text-emerald-600 text-sm mt-0.5">
                                ${p.price.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <Switch
                                    checked={p.in_stock}
                                    disabled={togglingId === p.id}
                                    onCheckedChange={() => handleToggleStock(p)}
                                />
                                <span className="text-xs text-muted-foreground">
                                    {p.in_stock ? "Diyaar" : "Dhamaaday"}
                                </span>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "h-8 w-8 shrink-0 cursor-pointer"
                                )}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit(p)}>
                                    <Edit className="h-4 w-4 mr-2" /> Wax ka beddel
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete(p)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" /> Tirtir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
            </div>
        </div>
    );
}