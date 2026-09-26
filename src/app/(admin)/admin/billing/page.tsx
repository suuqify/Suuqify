import { Metadata } from "next";
import { getAdminBillingAction } from "@/actions/admin/billing";
import { AdminBillingView } from "@/components/admin/billing/admin-billing-view";

export const metadata: Metadata = {
    title: "Billing & Revenue | Suuqify Admin",
    description: "Track all approved transactions and business income",
};

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function AdminBillingPage({ searchParams }: PageProps) {
    const resolved = await searchParams;
    const page = Number(resolved.page) || 1;

    const res = await getAdminBillingAction({ page });

    return (
        <AdminBillingView
            stats={
                res.stats || {
                    totalRevenue: 0,
                    thisMonthRevenue: 0,
                    totalTransactions: 0,
                    methodBreakdown: { evc: 0, zaad: 0, sahal: 0, edahab: 0 },
                }
            }
            transactions={res.transactions || []}
            totalCount={res.totalCount || 0}
            totalPages={res.totalPages || 1}
            currentPage={res.currentPage || 1}
        />
    );
}