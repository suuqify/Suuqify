import { Metadata } from "next";
import { getAdminStoresAction } from "@/actions/admin/stores";
import { StoresView } from "@/components/admin/stores/stores-view";

export const metadata: Metadata = {
    title: "Stores Management | Suuqify Admin",
    description: "Monitor and control merchant storefronts and verifications",
};

interface PageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        search?: string;
    }>;
}

export default async function AdminStoresPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1;
    const status = resolvedParams.status || "all";
    const search = resolvedParams.search || "";

    const res = await getAdminStoresAction({
        page,
        status,
        search,
    });

    return (
        <StoresView
            stores={res.stores || []}
            totalCount={res.totalCount || 0}
            totalPages={res.totalPages || 1}
            currentPage={res.currentPage || 1}
            currentStatus={status}
            currentSearch={search}
        />
    );
}