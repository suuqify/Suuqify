import { Metadata } from "next";
import { getAdminPaymentsAction } from "@/actions/admin/payments";
import { PaymentsView } from "@/components/admin/payments/payments-view";

export const metadata: Metadata = {
    title: "Payment Requests | Suuqify Admin",
    description: "Manage and verify manual subscription payments",
};

interface PageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        search?: string;
    }>;
}

export default async function AdminPaymentsPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const status = resolvedParams.status || "all";
    const search = resolvedParams.search || "";

    const res = await getAdminPaymentsAction({
        page,
        status,
        search,
    });

    return (
        <PaymentsView
            payments={res.payments || []}
            totalCount={res.totalCount || 0}
            totalPages={res.totalPages || 1}
            currentPage={res.currentPage || 1}
            currentStatus={status}
            currentSearch={search}
        />
    );
}