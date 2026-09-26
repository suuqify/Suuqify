import React from "react";
import Link from "next/link";
import { Package, CheckCircle2, AlertTriangle, Layers, Calendar, ArrowRight } from "lucide-react";
import { StoreOverviewData } from "@/actions/store/overview";

interface StatsGridProps {
    stats: StoreOverviewData["stats"];
    subscription: StoreOverviewData["subscription"];
}

export function StatsGrid({ stats, subscription }: StatsGridProps) {
    const percentUsed =
        stats.productsLimit > 0
            ? Math.min(100, Math.round((stats.totalProducts / stats.productsLimit) * 100))
            : 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Products & Usage Progress */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between text-muted-foreground mb-1">
                        <span className="text-xs font-medium uppercase tracking-wider">Alaabta Guud</span>
                        <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-bold text-foreground">
                            {stats.totalProducts}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                            / {stats.productsLimit} Xadka
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${percentUsed >= 90 ? "bg-amber-500" : "bg-primary"
                                }`}
                            style={{ width: `${percentUsed}%` }}
                        />
                    </div>
                </div>
                <div className="mt-3 pt-2 text-[11px] text-muted-foreground flex justify-between items-center">
                    <span>{percentUsed}% waa la isticmaalay</span>
                    {percentUsed >= 100 && (
                        <Link href="/store/plans" className="text-primary font-semibold hover:underline">
                            Kordhi
                        </Link>
                    )}
                </div>
            </div>

            {/* 2. In Stock Products */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between text-muted-foreground mb-1">
                        <span className="text-xs font-medium uppercase tracking-wider">Diyaar ah (In Stock)</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                        {stats.inStockCount}
                    </div>
                </div>
                <p className="mt-3 pt-2 text-[11px] text-emerald-600 font-medium">
                    Macaamiishu toos bay u dalban karaan
                </p>
            </div>

            {/* 3. Out of Stock */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between text-muted-foreground mb-1">
                        <span className="text-xs font-medium uppercase tracking-wider">Dhamaatay (Out of Stock)</span>
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                        {stats.outOfStockCount}
                    </div>
                </div>
                <p className="mt-3 pt-2 text-[11px] text-muted-foreground">
                    Badhanka dalabka wuu xiran yahay
                </p>
            </div>

            {/* 4. Active Subscription */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between text-muted-foreground mb-1">
                        <span className="text-xs font-medium uppercase tracking-wider">Qorshaha Hadda</span>
                        <Layers className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex items-baseline justify-between">
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                            {subscription?.planName || "Bilaa Heshiis"}
                        </span>
                        {subscription && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {subscription.daysLeft} cisho
                            </span>
                        )}
                    </div>
                </div>
                <div className="mt-3 pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">
                        {subscription ? `Dhacaya: ${new Date(subscription.endDate).toLocaleDateString()}` : "Qorshe dooro"}
                    </span>
                    <Link
                        href="/store/subscription"
                        className="text-primary font-semibold hover:underline flex items-center gap-0.5"
                    >
                        Faahfaahin <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
}