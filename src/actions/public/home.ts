"use server";

import { createClient } from "@/utils/supabase/server";

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

export interface PublicPlanItem {
    id: string;
    name: string;
    price: number;
    duration: number;
    maxProduct: number;
    isFeature: boolean;
}

export async function getFeaturedStoresAction(): Promise<FeaturedStoreItem[]> {
    try {
        const supabase = await createClient();

        // Query toos ah oo soo saaraya dukaamada leh Active Subscription oo VIP ah
        const { data, error } = await supabase
            .from("subscriptions")
            .select(`
                status,
                end_date,
                plans!inner (
                    id,
                    name,
                    is_feature
                ),
                stores!inner (
                    id,
                    name,
                    logo_url,
                    back_logo_url,
                    bio,
                    is_verified,
                    status,
                    cities ( name ),
                    categories ( name )
                )
            `)
            .eq("status", "active")
            .eq("stores.status", "active")
            .gt("end_date", new Date().toISOString());

        if (error || !data) {
            console.error("Featured Stores Error:", error);
            return [];
        }

        const vipStores: FeaturedStoreItem[] = [];

        for (const item of data) {
            const plan: any = item.plans;
            const store: any = item.stores;

            // Hubi in qorshuhu yahay VIP (is_feature == true ama magaciisu VIP yahay)
            const isVip = plan && (plan.is_feature === true || plan.name?.toLowerCase().includes("vip"));

            if (isVip && store) {
                // Ka hortag in dukaan labo jeer soo noqdo
                if (!vipStores.some((s) => s.id === store.id)) {
                    vipStores.push({
                        id: store.id,
                        name: store.name,
                        logoUrl: store.logo_url,
                        backLogoUrl: store.back_logo_url,
                        bio: store.bio,
                        cityName: store.cities?.name || "Soomaaliya",
                        categoryName: store.categories?.name || "Ganacsi",
                        isVerified: Boolean(store.is_verified),
                    });
                }
            }
        }

        return vipStores;
    } catch (err) {
        console.error("getFeaturedStoresAction Exception:", err);
        return [];
    }
}

export async function getPublicPlansAction(): Promise<PublicPlanItem[]> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("plans")
            .select("id, name, price, duration, max_product, is_feature")
            .order("price", { ascending: true });

        if (error || !data) {
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
        return [];
    }
}

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
        return {
            featuredStores: [],
            plans: [],
        };
    }
}