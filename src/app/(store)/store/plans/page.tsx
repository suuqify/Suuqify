import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { PlansView } from "@/components/store/plans/plans-view";

export const metadata: Metadata = {
    title: "Qorshayaasha & Xirmooyinka | Suuqify",
    description: "Dooro qorshaha ku habboon kobaca dukaankaaga.",
};

export default async function PlansPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    // Hel dukaanka
    const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!store) {
        redirect("/onboarding");
    }

    // Soo qaado dhammaan qorshayaasha la heli karo (oo u kala habaysan qiimaha yar ilaa weyn)
    const { data: plans } = await supabase
        .from("plans")
        .select("id, name, price, duration, max_product, is_feature")
        .order("price", { ascending: true });

    // Soo qaado qorshaha dukaanku hadda ku jiro hadduu jiro
    const { data: currentSub } = await supabase
        .from("subscriptions")
        .select("plan_id, status, end_date")
        .eq("store_id", store.id)
        .eq("status", "active")
        .order("end_date", { ascending: false })
        .limit(1)
        .maybeSingle();

    return (
        <PlansView
            plans={plans || []}
            activeSubscription={currentSub || null}
        />
    );
}