"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AdminPaymentRecord } from "@/actions/admin/payments";
import { PaymentDetailDialog } from "./payment-detail-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, ChevronLeft, ChevronRight, Filter } from "lucide-react";

interface PaymentsViewProps {
    payments: AdminPaymentRecord[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    currentStatus: string;
    currentSearch: string;
}

export function PaymentsView({
    payments,
    totalCount,
    totalPages,
    currentPage,
    currentStatus,
    currentSearch,
}: PaymentsViewProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [selectedPayment, setSelectedPayment] = useState<AdminPaymentRecord | null>(null);
    const [searchInput, setSearchInput] = useState(currentSearch);

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

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Payment Requests
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                    Review, verify, and approve incoming mobile money subscription payments.
                </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Status Filter Buttons */}
                <div className="inline-flex p-1 bg-muted rounded-xl border border-border/60 self-start">
                    {[
                        { label: "All", value: "all" },
                        { label: "Pending", value: "pending" },
                        { label: "Approved", value: "approved" },
                        { label: "Rejected", value: "rejected" },
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
                            placeholder="Search sender phone..."
                            className="pl-9 text-xs h-9 rounded-xl bg-card"
                        />
                    </div>
                    <Button type="submit" variant="secondary" size="sm" className="h-9 rounded-xl text-xs font-medium">
                        Search
                    </Button>
                </form>
            </div>

            {/* Payments Content Table & Cards */}
            <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden">
                {payments.length === 0 ? (
                    <div className="p-12 text-center text-sm text-muted-foreground">
                        No payment requests found for this filter.
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider border-b border-border/60">
                                    <tr>
                                        <th className="py-3 px-4 font-medium">Store & Owner</th>
                                        <th className="py-3 px-4 font-medium">Plan</th>
                                        <th className="py-3 px-4 font-medium">Amount</th>
                                        <th className="py-3 px-4 font-medium">Method & Phone</th>
                                        <th className="py-3 px-4 font-medium">Status</th>
                                        <th className="py-3 px-4 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {payments.map((p) => (
                                        <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-foreground">{p.store.name}</div>
                                                <div className="text-xs text-muted-foreground">{p.store.owner.fullName}</div>
                                            </td>
                                            <td className="py-3.5 px-4 font-medium text-foreground">
                                                {p.plan.name}
                                                <span className="block text-[11px] text-muted-foreground font-normal">
                                                    {p.plan.duration} Days
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-foreground text-base">
                                                ${p.amount}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs">
                                                <span className="font-medium text-foreground">{p.paymentMethod}</span>
                                                <div className="font-mono text-muted-foreground">{p.senderPhone}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <Badge
                                                    variant="outline"
                                                    className={`capitalize px-2 py-0.5 text-[11px] font-medium ${p.status === "approved"
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : p.status === "pending"
                                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                : "bg-rose-50 text-rose-700 border-rose-200"
                                                        }`}
                                                >
                                                    {p.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedPayment(p)}
                                                    className="h-8 rounded-xl text-xs gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Review</span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards View */}
                        <div className="md:hidden divide-y divide-border/60">
                            {payments.map((p) => (
                                <div key={p.id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-sm text-foreground block">
                                                {p.store.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {p.store.owner.fullName}
                                            </span>
                                        </div>
                                        <span className="font-extrabold text-base text-foreground">${p.amount}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>
                                            {p.plan.name} • <span className="font-mono text-foreground">{p.senderPhone}</span>
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={`capitalize px-2 py-0.5 text-[10px] font-medium ${p.status === "approved"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : p.status === "pending"
                                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                                        : "bg-rose-50 text-rose-700 border-rose-200"
                                                }`}
                                        >
                                            {p.status}
                                        </Badge>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedPayment(p)}
                                        className="w-full h-8 text-xs font-medium rounded-xl gap-1.5"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        Review Details & Action
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            Page {currentPage} of {totalPages} ({totalCount} total)
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

            {/* Review & Action Dialog */}
            <PaymentDetailDialog
                payment={selectedPayment}
                isOpen={Boolean(selectedPayment)}
                onClose={() => setSelectedPayment(null)}
            />
        </div>
    );
}