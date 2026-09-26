"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AdminStoreItem } from "@/actions/admin/stores";
import {
    approveAndVerifyStoreAction,
    deleteStoreAdminAction,
} from "@/actions/admin/stores";
import { StoreDetailDialog } from "./store-detail-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Search,
    Eye,
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Trash2,
    ExternalLink,
} from "lucide-react";

interface StoresViewProps {
    stores: AdminStoreItem[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    currentStatus: string;
    currentSearch: string;
}

export function StoresView({
    stores,
    totalCount,
    totalPages,
    currentPage,
    currentStatus,
    currentSearch,
}: StoresViewProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [selectedStore, setSelectedStore] = useState<AdminStoreItem | null>(null);
    const [searchInput, setSearchInput] = useState(currentSearch);
    const [isPending, startTransition] = useTransition();

    const updateFilters = (newStatus?: string, newSearch?: string, newPage?: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newStatus !== undefined) {
            if (newStatus === "all") params.delete("status");
            else params.set("status", newStatus);
            params.set("page", "1");
        }

        if (newSearch !== undefined) {
            if (!newSearch) params.delete("search");
            else params.set("search", newSearch);
            params.set("page", "1");
        }

        if (newPage !== undefined) {
            params.set("page", newPage.toString());
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters(undefined, searchInput.trim());
    };

    const handleQuickApprove = (storeId: string) => {
        startTransition(async () => {
            const res = await approveAndVerifyStoreAction(storeId);
            if (res.success) toast.success(res.message);
            else toast.error(res.error);
        });
    };

    const handleDeleteStore = (storeId: string, storeName: string) => {
        if (confirm(`Ma hubtaa inaad tirtirto dukaanka "${storeName}" iyo dhammaan alaabtiisa?`)) {
            startTransition(async () => {
                const res = await deleteStoreAdminAction(storeId);
                if (res.success) toast.success(res.message);
                else toast.error(res.error);
            });
        }
    };

    const getStatusBadge = (status: AdminStoreItem["status"]) => {
        switch (status) {
            case "active":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "suspended":
                return "bg-rose-50 text-rose-700 border-rose-200";
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Stores Management
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                    Oversee merchant storefronts, grant verification badges, and approve new signups.
                </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Status Tabs */}
                <div className="inline-flex p-1 bg-muted rounded-xl border border-border/60 self-start">
                    {[
                        { label: "All Stores", value: "all" },
                        { label: "Active", value: "active" },
                        { label: "Pending", value: "pending" },
                        { label: "Suspended", value: "suspended" },
                    ].map((tab) => {
                        const isActive =
                            currentStatus === tab.value || (!currentStatus && tab.value === "all");
                        return (
                            <button
                                key={tab.value}
                                onClick={() => updateFilters(tab.value)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${isActive
                                        ? "bg-card text-foreground shadow-xs"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-sm w-full">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search store name..."
                            className="pl-9 text-xs h-9 rounded-xl bg-card"
                        />
                    </div>
                    <Button type="submit" variant="secondary" size="sm" className="h-9 rounded-xl text-xs font-medium">
                        Search
                    </Button>
                </form>
            </div>

            {/* Stores Table Container */}
            <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden">
                {stores.length === 0 ? (
                    <div className="p-12 text-center text-sm text-muted-foreground">
                        No stores match the selected filter.
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider border-b border-border/60">
                                    <tr>
                                        <th className="py-3 px-4 font-medium">Store</th>
                                        <th className="py-3 px-4 font-medium">Owner</th>
                                        <th className="py-3 px-4 font-medium">City & Category</th>
                                        <th className="py-3 px-4 font-medium">Products</th>
                                        <th className="py-3 px-4 font-medium">Status</th>
                                        <th className="py-3 px-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {stores.map((s) => (
                                        <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-muted border border-border/70 overflow-hidden relative shrink-0 flex items-center justify-center font-bold text-primary">
                                                        {s.logoUrl ? (
                                                            <Image src={s.logoUrl} alt={s.name} fill className="object-cover" />
                                                        ) : (
                                                            s.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                                                            <span>{s.name}</span>
                                                            {s.isVerified && (
                                                                <BadgeCheck className="w-4 h-4 text-emerald-500 fill-emerald-100 shrink-0" />
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] font-mono text-muted-foreground">
                                                            {s.whatsappNumber}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="font-medium text-foreground block">{s.owner.fullName}</span>
                                                <span className="text-xs text-muted-foreground font-mono">{s.owner.phoneNumber}</span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs">
                                                <span className="font-medium text-foreground">{s.cityName}</span>
                                                <span className="block text-muted-foreground">{s.categoryName}</span>
                                            </td>
                                            <td className="py-3.5 px-4 font-semibold text-foreground text-xs">
                                                {s.productsCount} Items
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <Badge
                                                    variant="outline"
                                                    className={`capitalize px-2 py-0.5 text-[11px] font-medium ${getStatusBadge(
                                                        s.status
                                                    )}`}
                                                >
                                                    {s.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {s.status === "pending" && (
                                                        <Button
                                                            size="sm"
                                                            disabled={isPending}
                                                            onClick={() => handleQuickApprove(s.id)}
                                                            className="h-8 rounded-xl text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-2.5"
                                                        >
                                                            Approve
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedStore(s)}
                                                        className="h-8 rounded-xl text-xs gap-1"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>Details</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={isPending}
                                                        onClick={() => handleDeleteStore(s.id, s.name)}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 rounded-xl"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-border/60">
                            {stores.map((s) => (
                                <div key={s.id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-9 w-9 rounded-xl bg-muted border border-border/70 overflow-hidden relative shrink-0 flex items-center justify-center font-bold text-primary text-sm">
                                                {s.logoUrl ? (
                                                    <Image src={s.logoUrl} alt={s.name} fill className="object-cover" />
                                                ) : (
                                                    s.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-foreground flex items-center gap-1">
                                                    <span>{s.name}</span>
                                                    {s.isVerified && (
                                                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">{s.cityName} • {s.categoryName}</span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`capitalize px-2 py-0.5 text-[10px] font-medium ${getStatusBadge(
                                                s.status
                                            )}`}
                                        >
                                            {s.status}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Owner: {s.owner.fullName}</span>
                                        <span className="font-semibold text-foreground">{s.productsCount} Products</span>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        {s.status === "pending" && (
                                            <Button
                                                size="sm"
                                                disabled={isPending}
                                                onClick={() => handleQuickApprove(s.id)}
                                                className="flex-1 h-8 rounded-xl text-xs bg-primary font-semibold"
                                            >
                                                Approve
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedStore(s)}
                                            className="flex-1 h-8 rounded-xl text-xs gap-1"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            Page {currentPage} of {totalPages} ({totalCount} stores)
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage <= 1}
                                onClick={() => updateFilters(undefined, undefined, currentPage - 1)}
                                className="h-8 px-2.5 rounded-lg"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages}
                                onClick={() => updateFilters(undefined, undefined, currentPage + 1)}
                                className="h-8 px-2.5 rounded-lg"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Store Deep Dive Modal */}
            <StoreDetailDialog
                store={selectedStore}
                isOpen={Boolean(selectedStore)}
                onClose={() => setSelectedStore(null)}
            />
        </div>
    );
}