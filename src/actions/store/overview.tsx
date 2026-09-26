"use server";

import { createClient } from "@/utils/supabase/server";

export interface StoreOverviewData {
    store: {
        id: string;
        name: string;
        whatsappNumber: string;
        logoUrl: string | null;
        backLogoUrl: string | null;
        bio: string | null;
        isVerified: boolean;
        status: string;
        cityName: string;
        categoryName: string;
    };
    subscription: {
        planName: string;
        maxProducts: number;
        daysLeft: number;
        endDate: string;
        isActive: boolean;
    } | null;
    stats: {
        totalProducts: number;
        inStockCount: number;
        outOfStockCount: number;
        productsLimit: number;
    };
    recentProducts: {
        id: string;
        name: string;
        price: number;
        image: string;
        inStock: boolean;
        createdAt: string;
    }[];
}

export async function getStoreDashboardOverviewAction(): Promise<{
    success: boolean;
    data?: StoreOverviewData;
    error?: string;
}> {
    try {
        const supabase = await createClient();

        // 1. Hubi user-ka soo galay
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "Fadlan soo gal nidaamka." };
        }

        // 2. Soo qaad Dukaanka uu leeyahay
        const { data: store, error: storeError } = await supabase
            .from("stores")
            .select(`
        id,
        name,
        whatsapp_number,
        logo_url,
        back_logo_url,
        bio,
        is_verified,
        status,
        cities ( name ),
        categories ( name )
      `)
            .eq("owner_id", user.id)
            .single();

        if (storeError || !store) {
            return { success: false, error: "Dukaan laguma helin akoonkan." };
        }

        // 3. Soo qaad Active Subscription-ka
        const { data: activeSub } = await supabase
            .from("subscriptions")
            .select(`
        id,
        status,
        end_date,
        plans (
          name,
          max_product
        )
      `)
            .eq("store_id", store.id)
            .eq("status", "active")
            .gt("end_date", new Date().toISOString())
            .order("end_date", { ascending: false })
            .limit(1)
            .single();

        let subscriptionData = null;
        let productsLimit = 0;

        if (activeSub) {
            const endDate = new Date(activeSub.end_date);
            const today = new Date();
            const diffTime = endDate.getTime() - today.getTime();
            const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            const planName = (activeSub.plans as any)?.name || "Standard";
            productsLimit = (activeSub.plans as any)?.max_product || 15;

            subscriptionData = {
                planName,
                maxProducts: productsLimit,
                daysLeft,
                endDate: activeSub.end_date,
                isActive: true,
            };
        }

        // 4. Soo qaad Alaabta & Xisaabaadka
        const { data: products } = await supabase
            .from("products")
            .select("id, name, price, image, in_stock, created_at")
            .eq("store_id", store.id)
            .order("created_at", { ascending: false });

        const totalProducts = products?.length || 0;
        const inStockCount = (products || []).filter((p) => p.in_stock).length;
        const outOfStockCount = totalProducts - inStockCount;

        const recentProducts = (products || []).slice(0, 4).map((p) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            image: p.image,
            inStock: Boolean(p.in_stock),
            createdAt: p.created_at,
        }));

        return {
            success: true,
            data: {
                store: {
                    id: store.id,
                    name: store.name,
                    whatsappNumber: store.whatsapp_number,
                    logoUrl: store.logo_url,
                    backLogoUrl: store.back_logo_url,
                    bio: store.bio,
                    isVerified: Boolean(store.is_verified),
                    status: store.status,
                    cityName: (store.cities as any)?.name || "N/A",
                    categoryName: (store.categories as any)?.name || "N/A",
                },
                subscription: subscriptionData,
                stats: {
                    totalProducts,
                    inStockCount,
                    outOfStockCount,
                    productsLimit,
                },
                recentProducts,
            },
        };
    } catch (err: any) {
        console.error("Store Overview Error:", err);
        return { success: false, error: "Khalad ayaa dhacay marka xogta la soo qaadayay." };
    }
}