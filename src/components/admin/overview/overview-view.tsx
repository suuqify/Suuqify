import React from "react";
import { OverviewViewProps } from "./types";
import { OverviewStats } from "./overview-stats";
import { RecentPayments } from "./recent-payments";
import { RecentStores } from "./recent-stores";

export function OverviewView({ initialData }: OverviewViewProps) {
    return (
        <div className="space-y-6">
            {/* 1. Metric Cards */}
            <OverviewStats stats={initialData.stats} />

            {/* 2. Recent Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentPayments payments={initialData.recentPayments} />
                <RecentStores stores={initialData.recentStores} />
            </div>
        </div>
    );
}