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
    const cityId = formData.get("city_id") as string;
    const categoryId = formData.get("category_id") as string;

    // Xaqiiji dhererka magaca
    if (!storeName || storeName.length < 3) {
        return { error: "Magaca dukaanku waa inuu ka koobnaadaa ugu yaraan 3 xaraf." };
    }

    // 1. Hubi haddii magacan horey loo qaatay (ilike waxay hubisaa xuruufta waaweyn & yaryar)
    const { data: existingStore } = await supabase
        .from("stores")
        .select("id")
        .ilike("name", storeName)
        .maybeSingle();

    if (existingStore) {
        return {
            error: `Magaca "${storeName}" horey ayaa loo qaatay. Fadlan dooro magac kale oo kuu gaar ah.`,
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

    // 3. Abuur dukaanka cusub
    const { error: storeError } = await supabase.from("stores").insert({
        owner_id: user.id,
        name: storeName,
        whatsapp_number: whatsappNumber,
        city_id: cityId || null,
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