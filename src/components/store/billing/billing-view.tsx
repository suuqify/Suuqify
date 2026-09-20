"use client";

import Link from "next/link";
import {
    CreditCard,
    CheckCircle2,
    Clock,
    XCircle,
    Receipt,
    Smartphone,
    Calendar,
    ArrowUpRight,
    TrendingUp,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { BillingResponse } from "./types";
import { BillingPagination } from "./billing-pagination";
import { cn } from "@/lib/utils";

interface BillingViewProps {
    data: BillingResponse;
}

// Helper function beddelaya 'date-fns'
function formatDate(dateStr: string, includeTime = false): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    const dateFormatted = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);

    if (!includeTime) return dateFormatted;

    const timeFormatted = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(date);

    return `${dateFormatted}, ${timeFormatted}`;
}

export function BillingView({ data }: BillingViewProps) {
    const { payments, stats, currentPage, totalPages } = data;

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 rounded-full px-2.5 py-0.5 font-medium text-xs flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        La Ansixiyay
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/15 rounded-full px-2.5 py-0.5 font-medium text-xs flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        La Diiday
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/15 rounded-full px-2.5 py-0.5 font-medium text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3 animate-spin duration-1000" />
                        Sugitaan
                    </Badge>
                );
        }
    };

    return (
        <div className="space-y-6 pb-12 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Taariikhda Lacag-bixinta
                    </h1>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                        Kala soco heshiisyadaada, xaaladdooda xaqiijinta, iyo lacagaha aad ku bixisay adeegyada.
                    </p>
                </div>
                <Link
                    href="/store/plans"
                    className={cn(
                        buttonVariants(),
                        "h-10 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-medium gap-2 self-start sm:self-auto transition-all active:scale-[0.98]"
                    )}
                >
                    <CreditCard className="h-4 w-4" />
                    <span>Qorshe Cusub Iibso</span>
                </Link>
            </div>

            {/* Stats Cards - Modern Fintech Style */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">

                {/* Total Spent Card */}
                <Card className="rounded-2xl border border-border/60 bg-linear-to-br from-card to-muted/20 shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Wadarta La Bixiyay
                        </CardTitle>
                        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                            ${stats.totalSpent.toFixed(2)}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Lacagaha rasmiga ah ee la ansixiyay
                        </p>
                    </CardContent>
                </Card>

                {/* Approved Count Card */}
                <Card className="rounded-2xl border border-border/60 bg-linear-to-br from-card to-muted/20 shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            La Ansixiyay
                        </CardTitle>
                        <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                            {stats.approvedCount}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Dalabaad guul ku dhammaaday
                        </p>
                    </CardContent>
                </Card>

                {/* Pending Count Card */}
                <Card className="rounded-2xl border border-border/60 bg-linear-to-br from-card to-muted/20 shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Sugitaan (Pending)
                        </CardTitle>
                        <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
                            <Clock className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400">
                            {stats.pendingCount}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Dalabaadka hadda dib-u-eegista ku jira
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table & List Section */}
            <Card className="rounded-2xl border border-border/60 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3.5 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm sm:text-base font-bold">
                                Diiwaanka Lacag-bixinnada
                            </CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                Liiska dhammaan dalabaadka lacag-bixinta ee dukaankaaga.
                            </CardDescription>
                        </div>
                        <span className="text-xs font-semibold bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                            Wadarta: {data.totalCount}
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {payments.length === 0 ? (
                        <div className="py-16 text-center space-y-3 px-4">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground border">
                                <Receipt className="h-7 w-7 opacity-70" />
                            </div>
                            <h3 className="font-bold text-foreground text-sm">Weli ma jirto lacag-bixin</h3>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                Ma aadan samayn wax dalab lacag-bixin ah. Dooro qorshe si aad u bilowdo isticmaalka dukaankaaga.
                            </p>
                            <Link
                                href="/store/plans"
                                className={cn(
                                    buttonVariants({ size: "sm" }),
                                    "mt-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                                )}
                            >
                                Eeg Qorshayaasha
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border/50 bg-muted/10 hover:bg-transparent">
                                            <TableHead className="font-semibold text-muted-foreground uppercase text-[11px] tracking-wider pl-6">
                                                Qorshaha
                                            </TableHead>
                                            <TableHead className="font-semibold text-muted-foreground uppercase text-[11px] tracking-wider">
                                                Lacagta
                                            </TableHead>
                                            <TableHead className="font-semibold text-muted-foreground uppercase text-[11px] tracking-wider">
                                                Habka
                                            </TableHead>
                                            <TableHead className="font-semibold text-muted-foreground uppercase text-[11px] tracking-wider">
                                                Lambarka Diraha
                                            </TableHead>
                                            <TableHead className="font-semibold text-muted-foreground uppercase text-[11px] tracking-wider">
                                                Taariikhda
                                            </TableHead>
                                            <TableHead className="font-semibold text-muted-foreground uppercase text-[11px] tracking-wider text-right pr-6">
                                                Xaaladda
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payments.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-muted/30 transition-colors border-b border-border/40 last:border-none"
                                            >
                                                <TableCell className="pl-6 py-4">
                                                    <span className="font-bold text-foreground block">
                                                        {item.plans?.name || "Qorshe"}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {item.plans?.duration} maalmood
                                                    </span>
                                                </TableCell>

                                                <TableCell className="font-mono font-bold text-foreground">
                                                    ${Number(item.amount).toFixed(2)}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className="font-medium text-[11px] bg-muted/80 text-foreground border border-border/40 rounded-lg px-2 py-0.5"
                                                    >
                                                        {item.payment_method}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="font-mono text-xs text-foreground/80 font-medium">
                                                    {item.sender_phone}
                                                </TableCell>

                                                <TableCell className="text-xs text-muted-foreground">
                                                    {formatDate(item.created_at, true)}
                                                </TableCell>

                                                <TableCell className="text-right pr-6">
                                                    <div className="inline-flex justify-end">
                                                        {renderStatusBadge(item.status)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card List View */}
                            <div className="divide-y divide-border/40 md:hidden">
                                {payments.map((item) => (
                                    <div key={item.id} className="p-4 space-y-3 hover:bg-muted/10 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="font-bold text-sm text-foreground">
                                                    {item.plans?.name || "Qorshe"}
                                                </h4>
                                                <span className="text-[11px] text-muted-foreground">
                                                    Muddada: {item.plans?.duration} maalmood
                                                </span>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1">
                                                <span className="font-black font-mono text-base text-foreground">
                                                    ${Number(item.amount).toFixed(2)}
                                                </span>
                                                {renderStatusBadge(item.status)}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs pt-2 border-t border-border/30 text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Smartphone className="h-3.5 w-3.5 text-primary" />
                                                <span className="font-mono font-medium text-foreground text-[11px]">
                                                    {item.sender_phone}
                                                </span>
                                                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md font-medium border border-border/40">
                                                    {item.payment_method}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px]">
                                                <Calendar className="h-3.5 w-3.5 opacity-70" />
                                                <span>{formatDate(item.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Pagination Controls */}
                    <div className="p-3.5 border-t border-border/50 bg-muted/5">
                        <BillingPagination currentPage={currentPage} totalPages={totalPages} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}