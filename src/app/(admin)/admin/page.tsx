import { Metadata } from "next";
import { getAdminOverviewAction } from "@/actions/admin/overview";
import { OverviewView } from "@/components/admin/overview/overview-view";

export const metadata: Metadata = {
    title: "Admin Overview | Suuqify",
    description: "Xarunta maamulka guud ee Suuqify",
};

export default async function AdminOverviewPage() {
    const res = await getAdminOverviewAction();

    if (!res.success || !res.data) {
        return (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm">
                {res.error || "Khalad ayaa dhacay marka xogta lasoo qaadayay."}
            </div>
        );
    }

    return <OverviewView initialData={res.data} />;
}