"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface PlanItem {
    id: string;
    name: string;
    price: number;
    duration: number;
    max_product: number;
    is_feature: boolean;
}

export async function getAdminPlansAction(): Promise<{
    success: boolean;
    plans?: PlanItem[];
    error?: string;
}> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("plans")
            .select("*")
            .order("price", { ascending: true });

        if (error) throw error;

        return {
            success: true,
            plans: (data || []).map((p) => ({
                id: p.id,
                name: p.name,
                price: Number(p.price),
                duration: p.duration,
                max_product: p.max_product,
                is_feature: Boolean(p.is_feature),
            })),
        };
    } catch (err: any) {
        console.error("Get Plans Error:", err);
        return { success: false, error: "Failed to fetch plans." };
    }
}

export async function createPlanAction(data: {
    name: string;
    price: number;
    duration: number;
    max_product: number;
    is_feature: boolean;
}) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from("plans").insert([
            {
                name: data.name.trim(),
                price: data.price,
                duration: data.duration,
                max_product: data.max_product,
                is_feature: data.is_feature,
            },
        ]);

        if (error) throw error;

        revalidatePath("/admin/plans");
        revalidatePath("/store/plans");
        return { success: true, message: "Qorshe cusub ayaa si guul leh loo abuuray!" };
    } catch (err: any) {
        console.error("Create Plan Error:", err);
        return { success: false, error: err.message || "Failed to create plan." };
    }
}

export async function updatePlanAction(
    id: string,
    data: {
        name: string;
        price: number;
        duration: number;
        max_product: number;
        is_feature: boolean;
    }
) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from("plans")
            .update({
                name: data.name.trim(),
                price: data.price,
                duration: data.duration,
                max_product: data.max_product,
                is_feature: data.is_feature,
            })
            .eq("id", id);

        if (error) throw error;

        revalidatePath("/admin/plans");
        revalidatePath("/store/plans");
        return { success: true, message: "Qorshaha si guul leh ayaa loo cusboonaysiiyay!" };
    } catch (err: any) {
        console.error("Update Plan Error:", err);
        return { success: false, error: err.message || "Failed to update plan." };
    }
}

export async function deletePlanAction(id: string) {
    try {
        const supabase = await createClient();

        // Hubi haddii subscription ama payment ay ku xiran yihiin
        const { count } = await supabase
            .from("subscriptions")
            .select("*", { count: "exact", head: true })
            .eq("plan_id", id);

        if (count && count > 0) {
            return {
                success: false,
                error: "Qorshahan lama tirtiri karo sababtoo ah dukaamo ayaa hadda isticmaalaya.",
            };
        }

        const { error } = await supabase.from("plans").delete().eq("id", id);
        if (error) throw error;

        revalidatePath("/admin/plans");
        revalidatePath("/store/plans");
        return { success: true, message: "Qorshaha si guul leh ayaa loo tirtiray!" };
    } catch (err: any) {
        console.error("Delete Plan Error:", err);
        return { success: false, error: err.message || "Failed to delete plan." };
    }
}