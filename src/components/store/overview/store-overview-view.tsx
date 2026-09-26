import React from "react";
import { StoreOverviewData } from "@/actions/store/overview";
import { StoreLinkBanner } from "./store-link-banner";
import { StatsGrid } from "./stats-grid";
import { QuickActions } from "./quick-actions";
import { RecentProductsCard } from "./recent-product-card";

interface StoreOverviewViewProps {
    data: StoreOverviewData;
}

export function StoreOverviewView({ data }: StoreOverviewViewProps) {
    return (
        <div className="space-y-6">
            {/* 1. Hero Shareable Link Banner */}
            <StoreLinkBanner
                storeName={data.store.name}
                isVerified={data.store.isVerified}
            />

            {/* 2. Stats Grid & Limits Progress */}
            <StatsGrid stats={data.stats} subscription={data.subscription} />

            {/* 3. Quick Action Shortcuts */}
            <QuickActions />

            {/* 4. Recent Products Inventory Card */}
            <RecentProductsCard products={data.recentProducts} />
        </div>
    );
}