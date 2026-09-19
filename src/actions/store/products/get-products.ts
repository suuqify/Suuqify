"use server";

import { createClient } from "@/utils/supabase/server";
import { Product, ProductsResponse } from "@/components/store/products/types";

export async function getStoreProductsAction(
    page: number = 1,
    limit: number = 2
): Promise<ProductsResponse> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Fadlan soo gal nidaamka");
    }

    const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!store) {
        return { products: [], totalCount: 0, totalPages: 0, currentPage: 1 };
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("store_id", store.id)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Error fetching products:", error);
        throw new Error("Khalad ayaa dhacay markii alaabta la soo qaadayay");
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
        products: (data as Product[]) || [],
        totalCount,
        totalPages,
        currentPage: page,
    };
}