"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// 1. Cusboonaysii Xogta Guud ee Dukaanka
export async function updateStoreGeneralAction(formData: {
    name: string;
    whatsapp_number: string;
    city_id: string;
    category_id: string;
    location: string;
    bio: string;
    about: string;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Fadlan soo gal nidaamka." };

    const storeName = formData.name.trim();

    // Hubi magaca dukaanka haddii uu jiro mid kale oo isku magac ah
    const { data: existingStore } = await supabase
        .from("stores")
        .select("id")
        .ilike("name", storeName)
        .neq("owner_id", user.id)
        .maybeSingle();

    if (existingStore) {
        return { error: `Magaca "${storeName}" horey ayaa loo qaatay. Fadlan dooro magac kale.` };
    }

    // Hubi dhererka Bio (160) iyo About (1000)
    if (formData.bio && formData.bio.length > 160) {
        return { error: "Bio-ga dukaanku kama badnaan karo 160 xaraf." };
    }
    if (formData.about && formData.about.length > 1000) {
        return { error: "Faahfaahinta dukaanku (About) kama badnaan karto 1000 xaraf." };
    }

    const { error } = await supabase
        .from("stores")
        .update({
            name: storeName,
            whatsapp_number: formData.whatsapp_number.trim(),
            city_id: formData.city_id || null,
            category_id: formData.category_id || null,
            location: formData.location.trim(),
            bio: formData.bio.trim(),
            about: formData.about.trim(),
        })
        .eq("owner_id", user.id);

    if (error) {
        return { error: "Khalad ayaa dhacay markii la cusboonaysiinayay xogta dukaanka." };
    }

    revalidatePath("/store/settings");
    revalidatePath("/store");
    return { success: true, message: "Xogta dukaanka si guul leh ayaa loo cusboonaysiiyay!" };
}

// 2. Cusboonaysii Sawirrada Dukaanka (Logo & Banner)
export async function updateStoreBrandingAction(branding: {
    logo_url?: string;
    back_logo_url?: string;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Fadlan soo gal nidaamka." };

    const { error } = await supabase
        .from("stores")
        .update({
            ...(branding.logo_url !== undefined && { logo_url: branding.logo_url }),
            ...(branding.back_logo_url !== undefined && { back_logo_url: branding.back_logo_url }),
        })
        .eq("owner_id", user.id);

    if (error) {
        return { error: "Khalad ayaa dhacay markii la kaydinayay sawirka." };
    }

    revalidatePath("/store/settings");
    revalidatePath("/store");
    return { success: true, message: "Sawirka dukaanka si guul leh ayaa loo beddelay!" };
}

// 3. Tirtir Dukaanka Kaliya
export async function deleteStoreAction() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Fadlan soo gal nidaamka." };

    const { error } = await supabase
        .from("stores")
        .delete()
        .eq("owner_id", user.id);

    if (error) {
        return { error: "Ma suurtogelin in dukaanka la tirtiro. Fadlan isku day markale." };
    }

    revalidatePath("/", "layout");
    return { success: true };
}