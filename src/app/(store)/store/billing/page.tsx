import { Metadata } from "next";
import { getStorePaymentsAction } from "@/actions/store/billing";
import { BillingView } from "@/components/store/billing/billing-view";

export const metadata: Metadata = {
    title: "Taariikhda Lacag-bixinta (Billing) | Suuqify",
    description: "Kala soco lacagaha aad bixisay iyo taariikhda heshiisyadaada dukaanka.",
};

interface BillingPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams?.page) || 1;

    // Soo jiido xogta billing-ka oo wadata pagination iyo stats
    const data = await getStorePaymentsAction(page, 8);

    return <BillingView data={data} />;
}