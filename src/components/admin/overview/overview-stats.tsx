import React from "react";
import { AdminOverviewStats } from "@/actions/admin/overview";
import { DollarSign, Clock, Store, AlertCircle } from "lucide-react";

interface OverviewStatsProps {
    stats: AdminOverviewStats;
}

export function OverviewStats({ stats }: OverviewStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Revenue */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Wadarta Dakhliga
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        ${stats.totalRevenue.toLocaleString()}
                    </p>
                    <span className="inline-block text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Heshiisyada la ansixiyay
                    </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-6 h-6 stroke-[2.2]" />
                </div>
            </div>

            {/* 2. Pending Payments */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Lacagaha Sugaya
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {stats.pendingPaymentsCount}
                    </p>
                    <span
                        className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${stats.pendingPaymentsCount > 0
                                ? "bg-amber-100 text-amber-800 animate-pulse"
                                : "bg-muted text-muted-foreground"
                            }`}
                    >
                        {stats.pendingPaymentsCount > 0 ? "U baahan xaqiijin" : "Wax pending ah ma jiraan"}
                    </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 stroke-[2.2]" />
                </div>
            </div>

            {/* 3. Active Stores */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Ganacsiyada Firfircoon
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {stats.activeStoresCount}
                    </p>
                    <span className="inline-block text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Ganacsiyada toos u furan
                    </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Store className="w-6 h-6 stroke-[2.2]" />
                </div>
            </div>

            {/* 4. Pending Stores */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Ganacsiyada Cusub
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {stats.pendingStoresCount}
                    </p>
                    <span
                        className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${stats.pendingStoresCount > 0
                                ? "bg-rose-100 text-rose-700"
                                : "bg-muted text-muted-foreground"
                            }`}
                    >
                        {stats.pendingStoresCount > 0 ? "Sugaya ogolaansho" : "Ma jiro codsi cusub"}
                    </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 stroke-[2.2]" />
                </div>
            </div>
        </div>
    );
}