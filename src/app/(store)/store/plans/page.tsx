import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PlansView } from "@/components/store/plans/plans-view";

export default async function PlansPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    // 1. Hel Dukaanka
    const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!store) {
        redirect("/onboarding");
    }

    // 2. Soo qaado dhammaan qorshayaasha
    const { data: plans } = await supabase
        .from("plans")
        .select("*")
        .order("price", { ascending: true });

    // 3. Soo qaado Active Subscription-ka hadda u socda (haddii uu jiro)
    const { data: activeSub } = await supabase
        .from("subscriptions")
        .select("*, plans(*)")
        .eq("store_id", store.id)
        .eq("status", "active")
        .gt("end_date", new Date().toISOString())
        .order("end_date", { ascending: false })
        .limit(1)
        .maybeSingle();

    // 4. Hubi haddii dukaankani HORAY u soo isticmaalay Free Trial ($0)
    const { data: allSubs } = await supabase
        .from("subscriptions")
        .select(`
            id,
            plans (
                price
            )
        `)
        .eq("store_id", store.id);

    const hasUsedTrial = (allSubs || []).some((s: any) => Number(s.plans?.price) === 0);

    return (
        <PlansView
            plans={plans || []}
            activeSubscription={activeSub}
            hasUsedTrial={hasUsedTrial}
        />
    );
}