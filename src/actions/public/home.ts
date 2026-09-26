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

export async function getHomePageDataAction() {
    try {
        const supabase = await createClient();

        // 1. Soo qaad Dukaamada VIP-da ah (Active subscriptions leh plan is_feature = true)
        const { data: featuredData } = await supabase
            .from("stores")
            .select(`
        id,
        name,
        logo_url,
        back_logo_url,
        bio,
        is_verified,
        cities ( name ),
        categories ( name ),
        subscriptions!inner (
          status,
          plans!inner ( is_feature )
        )
      `)
            .eq("status", "active")
            .eq("subscriptions.status", "active")
            .eq("subscriptions.plans.is_feature", true)
            .limit(6);

        const featuredStores: FeaturedStoreItem[] = (featuredData || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            logoUrl: s.logo_url,
            backLogoUrl: s.back_logo_url,
            bio: s.bio,
            cityName: s.cities?.name || "Soomaaliya",
            categoryName: s.categories?.name || "Dukaan",
            isVerified: Boolean(s.is_verified),
        }));

        // 2. Soo qaad Qorshayaasha (Plans)
        const { data: plansData } = await supabase
            .from("plans")
            .select("*")
            .order("price", { ascending: true });

        const plans: PublicPlanItem[] = (plansData || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            duration: p.duration,
            maxProduct: p.max_product,
            isFeature: Boolean(p.is_feature),
        }));

        return {
            featuredStores,
            plans,
        };
    } catch (err: any) {
        console.error("Home Data Action Error:", err);
        return { featuredStores: [], plans: [] };
    }
}