"use server";

import { createClient } from "@/utils/supabase/server";

// 1. Nooca Dukaamada VIP-da
export interface FeaturedStoreItem {
    id: string;
    name: string;
    logoUrl: string | null;
    backLogoUrl: string | null;
    bio: string | null;
    cityName: string;
    categoryName: string;
    isVerified: boolean;
}

// 2. Nooca Qorshayaasha Qiimaha
export interface PublicPlanItem {
    id: string;
    name: string;
    price: number;
    duration: number;
    maxProduct: number;
    isFeature: boolean;
}

// -------------------------------------------------------------
// A. Shaqada soo qaadaysa Dukaamada VIP-da
// -------------------------------------------------------------
export async function getFeaturedStoresAction(): Promise<FeaturedStoreItem[]> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("stores")
            .select(`
                id,
                name,
                logo_url,
                back_logo_url,
                bio,
                is_verified,
                status,
                cities ( name ),
                categories ( name ),
                subscriptions (
                    status,
                    end_date,
                    plans (
                        id,
                        name,
                        is_feature
                    )
                )
            `)
            .eq("status", "active");

        if (error || !data) {
            console.error("Featured Stores Fetch Error:", error);
            return [];
        }

        const vipStores: FeaturedStoreItem[] = [];

        for (const store of data) {
            const activeSub = (store.subscriptions || []).find((sub: any) => {
                const isSubActive = sub.status === "active" && new Date(sub.end_date) > new Date();
                const plan = sub.plans;
                const isVipPlan = plan && (plan.is_feature === true || plan.name?.toLowerCase().includes("vip"));
                return isSubActive && isVipPlan;
            });

            if (activeSub) {
                vipStores.push({
                    id: store.id,
                    name: store.name,
                    logoUrl: store.logo_url,
                    backLogoUrl: store.back_logo_url,
                    bio: store.bio,
                    cityName: (store.cities as any)?.name || "Soomaaliya",
                    categoryName: (store.categories as any)?.name || "Ganacsi",
                    isVerified: Boolean(store.is_verified),
                });
            }
        }

        return vipStores;
    } catch (err) {
        console.error("getFeaturedStoresAction Exception:", err);
        return [];
    }
}

// -------------------------------------------------------------
// B. Shaqada soo qaadaysa Qorshayaasha Qiimaha
// -------------------------------------------------------------
export async function getPublicPlansAction(): Promise<PublicPlanItem[]> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("plans")
            .select("id, name, price, duration, max_product, is_feature")
            .order("price", { ascending: true });

        if (error || !data) {
            console.error("Get Plans Error:", error);
            return [];
        }

        return data.map((p) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            duration: p.duration,
            maxProduct: p.max_product,
            isFeature: Boolean(p.is_feature),
        }));
    } catch (err) {
        console.error("getPublicPlansAction Exception:", err);
        return [];
    }
}

// -------------------------------------------------------------
// C. Shaqada Guud ee Bogga Hore (page.tsx) u yeerto
// -------------------------------------------------------------
export async function getHomePageDataAction() {
    try {
        const [featuredStores, plans] = await Promise.all([
            getFeaturedStoresAction(),
            getPublicPlansAction(),
        ]);

        return {
            featuredStores,
            plans,
        };
    } catch (err) {
        console.error("getHomePageDataAction Exception:", err);
        return {
            featuredStores: [],
            plans: [],
        };
    }
}