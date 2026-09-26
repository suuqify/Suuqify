"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BillingStats, BillingTransactionItem } from "@/actions/admin/billing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CalendarCheck, TrendingUp, ChevronLeft, ChevronRight, Phone } from "lucide-react";

interface AdminBillingViewProps {
    stats: BillingStats;
    transactions: BillingTransactionItem[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

export function AdminBillingView({
    stats,
    transactions,
    totalCount,
    totalPages,
    currentPage,
}: AdminBillingViewProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Billing & Revenue Transactions
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                    Audit trail of verified incoming revenues and gateway breakdowns.
                </p>
            </div>

            {/* Revenue Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Collected */}
                <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Total Revenue Collected
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-3xl font-extrabold text-foreground">
                            ${stats.totalRevenue.toLocaleString()}
                        </span>
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 stroke-[2.2]" />
                        </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-1 block">
                        {stats.totalTransactions} Approved Transactions
                    </span>
                </div>

                {/* This Month */}
                <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        This Month Revenue
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-3xl font-extrabold text-primary">
                            ${stats.thisMonthRevenue.toLocaleString()}
                        </span>
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <CalendarCheck className="w-5 h-5 stroke-[2.2]" />
                        </div>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                        Active Subscription Month
                    </span>
                </div>

                {/* Mobile Money Breakdown 1 */}
                <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        EVC Plus & Zaad
                    </p>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">EVC Plus:</span>
                        <span className="font-bold text-foreground">${stats.methodBreakdown.evc}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Zaad:</span>
                        <span className="font-bold text-foreground">${stats.methodBreakdown.zaad}</span>
                    </div>
                </div>

                {/* Mobile Money Breakdown 2 */}
                <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Sahal & eDahab
                    </p>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Sahal:</span>
                        <span className="font-bold text-foreground">${stats.methodBreakdown.sahal}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">eDahab:</span>
                        <span className="font-bold text-foreground">${stats.methodBreakdown.edahab}</span>
                    </div>
                </div>
            </div>

            {/* Transactions Audit Table */}
            <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-5 border-b border-border/70 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-base text-foreground">Verified Revenue Log</h3>
                        <p className="text-xs text-muted-foreground">
                            Official record of all activated subscriptions
                        </p>
                    </div>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-12 text-center text-sm text-muted-foreground">
                        No approved transactions found yet.
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider border-b border-border/60">
                                    <tr>
                                        <th className="py-3 px-4 font-medium">Store</th>
                                        <th className="py-3 px-4 font-medium">Owner</th>
                                        <th className="py-3 px-4 font-medium">Plan</th>
                                        <th className="py-3 px-4 font-medium">Amount</th>
                                        <th className="py-3 px-4 font-medium">Gateway & Phone</th>
                                        <th className="py-3 px-4 font-medium text-right">Date Approved</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-foreground">{t.storeName}</td>
                                            <td className="py-3.5 px-4 text-muted-foreground">{t.ownerName}</td>
                                            <td className="py-3.5 px-4 font-medium text-foreground">
                                                {t.planName}{" "}
                                                <span className="text-xs text-muted-foreground">({t.planDuration}d)</span>
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-600 text-base">
                                                +${t.amount}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs">
                                                <span className="font-semibold text-foreground">{t.paymentMethod}</span>
                                                <div className="font-mono text-muted-foreground">{t.senderPhone}</div>
                                            </td>
                                            <td className="py-3.5 px-4 text-right text-xs text-muted-foreground">
                                                {new Date(t.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-border/60">
                            {transactions.map((t) => (
                                <div key={t.id} className="p-4 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-foreground">{t.storeName}</span>
                                        <span className="font-extrabold text-sm text-emerald-600">+${t.amount}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>
                                            {t.planName} • {t.paymentMethod}
                                        </span>
                                        <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-[11px] text-muted-foreground font-mono">
                                        From: {t.senderPhone} ({t.ownerName})
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            Page {currentPage} of {totalPages} ({totalCount} items)
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage <= 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="h-8 px-2.5 rounded-lg"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="h-8 px-2.5 rounded-lg"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}