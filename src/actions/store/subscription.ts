"use server";

import { createClient } from "@/utils/supabase/server";
import { SubscriptionViewData } from "@/components/store/subscription/types";

export async function getStoreSubscriptionAction(): Promise<SubscriptionViewData> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Awood uma lihid.");
    }

    // 1. Hel dukaanka
    const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (storeError || !store) {
        throw new Error("Dukaan lama helin.");
    }

    // 2. Soo qaado tirada alaabta dukaankan hadda u diiwaangashan
    const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id);

    // 3. Soo qaado dhammaan subscriptions-ka dukaanka oo u habaysan kii ugu dambeeyay
    const { data: subscriptions, error: subError } = await supabase
        .from("subscriptions")
        .select(
            `
      id,
      status,
      start_date,
      end_date,
      plans (
        id,
        name,
        price,
        duration,
        max_product,
        is_feature
      )
    `
        )
        .eq("store_id", store.id)
        .order("end_date", { ascending: false });

    if (subError || !subscriptions) {
        return {
            currentSub: null,
            productCount: productCount || 0,
            pastSubscriptions: [],
        };
    }

    // Raadi qorshaha ugu dambeeyay ee hadda socda (Active ama dhacay)
    const now = new Date();
    let currentSub = null;
    const pastSubscriptions = [];

    for (const item of subscriptions) {
        const isExpired = new Date(item.end_date) < now;
        const computedStatus = isExpired ? "expired" : item.status;

        if (!currentSub && computedStatus === "active") {
            currentSub = {
                id: item.id,
                status: "active" as const,
                start_date: item.start_date,
                end_date: item.end_date,
                plan: item.plans as unknown as SubscriptionViewData["currentSub"] extends { plan: infer P } ? P : never,
            };
        } else if (!currentSub && subscriptions.indexOf(item) === 0) {
            // Haddii xataa uu dhacay oo uusan jirin mid active ah, kii ugu dambeeyay halkan u qabo
            currentSub = {
                id: item.id,
                status: computedStatus as "active" | "expired",
                start_date: item.start_date,
                end_date: item.end_date,
                plan: item.plans as unknown as SubscriptionViewData["currentSub"] extends { plan: infer P } ? P : never,
            };
        } else {
            pastSubscriptions.push({
                id: item.id,
                status: computedStatus,
                start_date: item.start_date,
                end_date: item.end_date,
                plan: item.plans
                    ? {
                        name: (item.plans as unknown as { name: string; price: number }).name,
                        price: (item.plans as unknown as { name: string; price: number }).price,
                    }
                    : null,
            });
        }
    }

    return {
        currentSub,
        productCount: productCount || 0,
        pastSubscriptions,
    };
}