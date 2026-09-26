"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface AdminStoreItem {
    id: string;
    name: string;
    whatsappNumber: string;
    logoUrl: string | null;
    backLogoUrl: string | null;
    bio: string | null;
    about: string | null;
    location: string | null;
    isVerified: boolean;
    status: "pending" | "active" | "suspended";
    createdAt: string;
    cityName: string;
    categoryName: string;
    owner: {
        id: string;
        fullName: string;
        phoneNumber: string;
    };
    subscription?: {
        planName: string;
        status: string;
        endDate: string;
    } | null;
    productsCount: number;
}

export interface GetStoresParams {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export async function getAdminStoresAction(params: GetStoresParams) {
    try {
        const supabase = await createClient();
        const page = params.page || 1;
        const limit = params.limit || 10;
        const offset = (page - 1) * limit;

        let query = supabase
            .from("stores")
            .select(
                `
        id,
        name,
        whatsapp_number,
        logo_url,
        back_logo_url,
        bio,
        about,
        location,
        is_verified,
        status,
        created_at,
        cities ( name ),
        categories ( name ),
        profiles (
          id,
          full_name,
          phone_number
        ),
        subscriptions (
          status,
          end_date,
          plans ( name )
        ),
        products ( count )
      `,
                { count: "exact" }
            )
            .order("created_at", { ascending: false });

        if (params.status && params.status !== "all") {
            query = query.eq("status", params.status);
        }

        if (params.search) {
            query = query.ilike("name", `%${params.search}%`);
        }

        const { data, count, error } = await query.range(offset, offset + limit - 1);

        if (error) throw error;

        const stores: AdminStoreItem[] = (data || []).map((s: any) => {
            // Find active subscription if any
            const activeSub = (s.subscriptions || []).find((sub: any) => sub.status === "active");

            return {
                id: s.id,
                name: s.name,
                whatsappNumber: s.whatsapp_number,
                logoUrl: s.logo_url,
                backLogoUrl: s.back_logo_url,
                bio: s.bio,
                about: s.about,
                location: s.location,
                isVerified: Boolean(s.is_verified),
                status: s.status,
                createdAt: s.created_at,
                cityName: s.cities?.name || "N/A",
                categoryName: s.categories?.name || "N/A",
                owner: {
                    id: s.profiles?.id || "",
                    fullName: s.profiles?.full_name || "N/A",
                    phoneNumber: s.profiles?.phone_number || "N/A",
                },
                subscription: activeSub
                    ? {
                        planName: activeSub.plans?.name || "Standard",
                        status: activeSub.status,
                        endDate: activeSub.end_date,
                    }
                    : null,
                productsCount: s.products?.[0]?.count || 0,
            };
        });

        return {
            success: true,
            stores,
            totalCount: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
            currentPage: page,
        };
    } catch (err: any) {
        console.error("Get Admin Stores Error:", err);
        return { success: false, error: "Could not fetch stores list." };
    }
}

// 1. Approve & Verify Store RPC Call
export async function approveAndVerifyStoreAction(storeId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc("admin_approve_and_verify_store", {
            p_store_id: storeId,
        });

        if (error) return { success: false, error: error.message };
        if (!data?.success) return { success: false, error: data?.error || "Action failed" };

        revalidatePath("/admin/stores");
        revalidatePath("/admin");
        return { success: true, message: "Store is now Active and Verified!" };
    } catch (err: any) {
        console.error("Approve Store Error:", err);
        return { success: false, error: "Failed to approve store." };
    }
}

// 2. Toggle Store Verification RPC Call
export async function toggleStoreVerifiedAction(storeId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc("admin_toggle_store_verified", {
            p_store_id: storeId,
        });

        if (error) return { success: false, error: error.message };
        if (!data?.success) return { success: false, error: data?.error || "Action failed" };

        revalidatePath("/admin/stores");
        return {
            success: true,
            isVerified: data.is_verified,
            message: `Store verification updated: ${data.is_verified ? "Verified" : "Unverified"}`,
        };
    } catch (err: any) {
        console.error("Toggle Verify Error:", err);
        return { success: false, error: "Failed to toggle verification." };
    }
}

// 3. Update Store Status RPC Call (Active / Suspended)
export async function updateStoreStatusAction(storeId: string, status: "active" | "suspended" | "pending") {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc("admin_update_store_status", {
            p_store_id: storeId,
            p_status: status,
        });

        if (error) return { success: false, error: error.message };
        if (!data?.success) return { success: false, error: data?.error || "Action failed" };

        revalidatePath("/admin/stores");
        revalidatePath("/admin");
        return { success: true, message: `Store status changed to ${status}.` };
    } catch (err: any) {
        console.error("Update Status Error:", err);
        return { success: false, error: "Failed to update status." };
    }
}

// 4. Delete Store with Full Storage Cleanup
export async function deleteStoreAdminAction(storeId: string) {
    try {
        const supabase = await createClient();

        // 1. Fetch images to cleanup
        const { data: storeData } = await supabase
            .from("stores")
            .select("logo_url, back_logo_url")
            .eq("id", storeId)
            .single();

        const { data: productsData } = await supabase
            .from("products")
            .select("image")
            .eq("store_id", storeId);

        // Delete store images from 'stores' bucket
        const storeFiles: string[] = [];
        if (storeData?.logo_url) {
            const parts = storeData.logo_url.split("/");
            storeFiles.push(parts[parts.length - 1]);
        }
        if (storeData?.back_logo_url) {
            const parts = storeData.back_logo_url.split("/");
            storeFiles.push(parts[parts.length - 1]);
        }
        if (storeFiles.length > 0) {
            await supabase.storage.from("stores").remove(storeFiles);
        }

        // Delete product images from 'products' bucket
        const productFiles: string[] = [];
        (productsData || []).forEach((p) => {
            if (p.image) {
                const parts = p.image.split("/");
                productFiles.push(parts[parts.length - 1]);
            }
        });
        if (productFiles.length > 0) {
            await supabase.storage.from("products").remove(productFiles);
        }

        // 2. Delete Store record (CASCADE removes products, subscriptions, etc.)
        const { error: deleteError } = await supabase
            .from("stores")
            .delete()
            .eq("id", storeId);

        if (deleteError) throw deleteError;

        revalidatePath("/admin/stores");
        revalidatePath("/admin");
        return { success: true, message: "Store and all associated data deleted cleanly." };
    } catch (err: any) {
        console.error("Delete Store Error:", err);
        return { success: false, error: "Failed to delete store." };
    }
}