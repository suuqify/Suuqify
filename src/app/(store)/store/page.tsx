import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getStoreDashboardOverviewAction } from "@/actions/store/overview";
import { StoreOverviewView } from "@/components/store/overview/store-overview-view";

export const metadata: Metadata = {
    title: "Maamulka Ganacsigaaga - Suuqify",
    description: "Xarunta maamulka Aeega iyo xogta Ganacsigaaga.",
};

export default async function StorePage() {
    const supabase = await createClient();

    // 1. Hubi qofka soo galay
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    // 2. Hubi in dukaanku jiro
    const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!store) {
        redirect("/onboarding");
    }

    // 3. Soo qaad dhammaan xogta buuxda ee Overview-ga cusub
    const res = await getStoreDashboardOverviewAction();

    if (!res.success || !res.data) {
        return (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-2xl text-sm">
                {res.error || "Khalad ayaa dhacay marka xogta Ganacsiga la soo qaadayay."}
            </div>
        );
    }

    return <StoreOverviewView data={res.data} />;
}