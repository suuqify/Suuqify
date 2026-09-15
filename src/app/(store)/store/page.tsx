import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { StoreOverview } from "@/components/store/store-overview";

export const metadata: Metadata = {
    title: "Maamulka Dukaanka - Suuqify",
    description: "Xarunta maamulka alaabta iyo xogta dukaankaaga.",
};

export default async function StorePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    const { data: store } = await supabase
        .from("stores")
        .select("name, whatsapp_number, status")
        .eq("owner_id", user.id)
        .single();

    if (!store) {
        redirect("/onboarding");
    }

    return <StoreOverview store={store} />;
}