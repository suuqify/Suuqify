"use server";

import { createClient } from "@/utils/supabase/server";

export async function getActiveCities() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("cities")
        .select("id, name")
        .eq("is_active", true)
        .order("name");
    return data ?? [];
}

export async function getActiveCategories() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("name");
    return data ?? [];
}

export async function createStoreAction(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Fadlan marka hore soo gal nidaamka." };
    }

    const phoneNumber = (formData.get("phone_number") as string)?.trim();
    const storeName = (formData.get("name") as string)?.trim();
    const whatsappNumber = (formData.get("whatsapp_number") as string)?.trim();
    const categoryId = formData.get("category_id") as string;

    // Qaado dhammaan magaalooyinka la doortay (Array)
    const cityIds = formData.getAll("city_ids") as string[];

    // Hubinta Magaca
    if (!storeName || storeName.length < 3) {
        return { error: "Magaca dukaanku waa inuu ka koobnaadaa ugu yaraan 3 xaraf." };
    }

    // Hubinta Magaalooyinka
    if (!cityIds || cityIds.length === 0) {
        return { error: "Fadlan dooro ugu yaraan hal magaalo oo aad ka hawlgasho." };
    }

    // 1. Hubi haddii magacan horey loo qaatay
    const { data: existingStore } = await supabase
        .from("stores")
        .select("id")
        .ilike("name", storeName)
        .maybeSingle();

    if (existingStore) {
        return {
            error: `Magaca "${storeName}" horey ayaa loo qaatay. Fadlan dooro magac kale.`,
        };
    }

    // 2. Cusboonaysii lambarka qofka ee profiles
    const { error: profileError } = await supabase
        .from("profiles")
        .update({ phone_number: phoneNumber })
        .eq("id", user.id);

    if (profileError) {
        return { error: "Qalad profiles: " + profileError.message };
    }

    // 3. Abuur dukaanka cusub adoo kaydinaya city_ids array
    const { error: storeError } = await supabase.from("stores").insert({
        owner_id: user.id,
        name: storeName,
        whatsapp_number: whatsappNumber,
        city_ids: cityIds,
        city_id: cityIds[0] || null, // Magaalada 1-aad ee aasaasiga ah
        category_id: categoryId || null,
        status: "pending",
    });

    if (storeError) {
        if (storeError.code === "23505") {
            return {
                error: `Magaca "${storeName}" horey ayaa loo qaatay. Fadlan dooro magac kale.`,
            };
        }
        return { error: "Qalad dukaanka: " + storeError.message };
    }

    return { success: true };
}