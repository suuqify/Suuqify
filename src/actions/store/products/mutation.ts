"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ProductOption } from "@/components/store/products/types";

interface ProductInput {
    name: string;
    price: number;
    image?: string | null;
    options?: ProductOption[];
    in_stock?: boolean;
}

// Helper function: Ka soo bixi path-ka saxda ah ee sawirka Supabase Storage URL
function extractStoragePath(url: string, bucketName: string): string | null {
    try {
        const parsed = new URL(url);
        const token = `/${bucketName}/`;
        const index = parsed.pathname.indexOf(token);
        if (index !== -1) {
            return decodeURIComponent(parsed.pathname.substring(index + token.length));
        }
        return null;
    } catch {
        return null;
    }
}

// 1. Abuur Alaab Cusub
export async function createProductAction(data: ProductInput) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Fadlan soo gal nidaamka" };

    const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!store) return { success: false, error: "Dukaan lama helin" };

    const { error } = await supabase.from("products").insert({
        store_id: store.id,
        name: data.name.trim(),
        price: data.price,
        image: data.image || null,
        options: data.options || [],
        in_stock: data.in_stock ?? true,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/store/products");
    return { success: true };
}

// 2. Wax ka beddel Alaabta (haddii sawir cusub la geliyo, kii hore waa la tirtirayaa)
export async function updateProductAction(id: string, data: ProductInput) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Fadlan soo gal nidaamka" };

    // Soo qaado sawirkii hore si loo hubiyo haddii la beddelay
    const { data: currentProduct } = await supabase
        .from("products")
        .select("image")
        .eq("id", id)
        .single();

    if (
        currentProduct?.image &&
        data.image !== undefined &&
        data.image !== currentProduct.image
    ) {
        const oldPath = extractStoragePath(currentProduct.image, "products");
        if (oldPath) {
            await supabase.storage.from("products").remove([oldPath]);
        }
    }

    const { error } = await supabase
        .from("products")
        .update({
            name: data.name.trim(),
            price: data.price,
            image: data.image,
            options: data.options || [],
            in_stock: data.in_stock,
        })
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/store/products");
    return { success: true };
}

// 3. Tirtir Alaabta + Sawirkeeda ku jira Storage
export async function deleteProductAction(id: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Fadlan soo gal nidaamka" };

    // 1. Soo qaad xogta alaabta si aynu u helno URL-ka sawirka
    const { data: product } = await supabase
        .from("products")
        .select("image")
        .eq("id", id)
        .single();

    // 2. Haddii ay sawir leedahay, ka masax Supabase Storage
    if (product?.image) {
        const path = extractStoragePath(product.image, "products");
        if (path) {
            await supabase.storage.from("products").remove([path]);
        }
    }

    // 3. Tirtir alaabta database-ka
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/store/products");
    return { success: true };
}

// 4. Degdeg u shid ama dami Alaabta (In Stock Toggle)
export async function toggleStockAction(id: string, in_stock: boolean) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Fadlan soo gal nidaamka" };

    const { error } = await supabase
        .from("products")
        .update({ in_stock })
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/store/products");
    return { success: true };
}