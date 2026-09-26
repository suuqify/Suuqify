"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface TaxonomyItem {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    stores_count?: number;
}

export async function getAdminCategoriesCities() {
    try {
        const supabase = await createClient();

        // Soo qaad categories
        const { data: categories, error: catError } = await supabase
            .from("categories")
            .select("id, name, is_active, created_at, stores(count)")
            .order("name", { ascending: true });

        if (catError) throw catError;

        // Soo qaad cities
        const { data: cities, error: cityError } = await supabase
            .from("cities")
            .select("id, name, is_active, created_at, stores(count)")
            .order("name", { ascending: true });

        if (cityError) throw cityError;

        return {
            success: true,
            categories: (categories || []).map((c: any) => ({
                id: c.id,
                name: c.name,
                is_active: Boolean(c.is_active),
                created_at: c.created_at,
                stores_count: c.stores?.[0]?.count || 0,
            })),
            cities: (cities || []).map((c: any) => ({
                id: c.id,
                name: c.name,
                is_active: Boolean(c.is_active),
                created_at: c.created_at,
                stores_count: c.stores?.[0]?.count || 0,
            })),
        };
    } catch (err: any) {
        console.error("Get Taxonomy Error:", err);
        return { success: false, categories: [], cities: [], error: "Failed to fetch taxonomy." };
    }
}

// Category Actions
export async function createCategoryAction(name: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from("categories").insert([{ name: name.trim() }]);
        if (error) throw error;
        revalidatePath("/admin/categories-cities");
        revalidatePath("/onboarding");
        return { success: true, message: "Qayb cusub ayaa lagu daray!" };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function updateCategoryAction(id: string, name: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from("categories").update({ name: name.trim() }).eq("id", id);
        if (error) throw error;
        revalidatePath("/admin/categories-cities");
        return { success: true, message: "Qaybta si guul leh ayaa loo cusboonaysiiyay!" };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function toggleCategoryActiveAction(id: string, currentStatus: boolean) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from("categories")
            .update({ is_active: !currentStatus })
            .eq("id", id);
        if (error) throw error;
        revalidatePath("/admin/categories-cities");
        return { success: true, message: `Qaybta waa la ${!currentStatus ? "shiday" : "damiyay"}.` };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteCategoryAction(id: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) throw error;
        revalidatePath("/admin/categories-cities");
        return { success: true, message: "Qaybta waa la tirtiray!" };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// City Actions
export async function createCityAction(name: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from("cities").insert([{ name: name.trim() }]);
        if (error) throw error;
        revalidatePath("/admin/categories-cities");
        revalidatePath("/onboarding");
        return { success: true, message: "Magaalo cusub ayaa lagu daray!" };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function updateCityAction(id: string, name: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from("cities").update({ name: name.trim() }).eq("id", id);
        if (error) throw error;
        revalidatePath("/admin/categories-cities");
        return { success: true, message: "Magaalada si guul leh ayaa loo cusboonaysiiyay!" };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function toggleCityActiveAction(id: string, currentStatus: boolean) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from("cities")
            .update({ is_active: !currentStatus })
            .eq("id", id);
        if (error) throw error;
        revalidatePath("/admin/categories-cities");
        return { success: true, message: `Magaalada waa la ${!currentStatus ? "shiday" : "damiyay"}.` };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteCityAction(id: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from("cities").delete().eq("id", id);
        if (error) throw error;
        revalidatePath("/admin/categories-cities");
        return { success: true, message: "Magaalada waa la tirtiray!" };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}