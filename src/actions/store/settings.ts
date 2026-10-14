"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

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

// 1. Cusboonaysii Xogta Guud ee Dukaanka (Multi-City Taageero leh)
// 1. Cusboonaysii Xogta Guud ee Dukaanka (Zero-Crash Protection)
export async function updateStoreGeneralAction(formData: {
    name: string;
    whatsapp_number: string;
    city_ids: string[];
    category_id: string;
    location: string;
    bio: string;
    about: string;
}) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return { error: "Fadlan soo gal nidaamka." };

        const storeName = (formData.name || "").trim();

        if (!storeName || storeName.length < 3) {
            return { error: "Magaca Ganacsigu waa inuu ka koobnaadaa ugu yaraan 3 xaraf." };
        }

        // Hubi haddii magaca dukaanka mid kale leeyahay
        const { data: existingStore } = await supabase
            .from("stores")
            .select("id")
            .ilike("name", storeName)
            .neq("owner_id", user.id)
            .maybeSingle();

        if (existingStore) {
            return {
                error: `Magaca "${storeName}" horey ayaa loo qaatay. Fadlan dooro magac kale.`,
            };
        }

        // Hubi Magaalooyinka
        if (!formData.city_ids || formData.city_ids.length === 0) {
            return { error: "Fadlan dooro ugu yaraan hal magaalo oo aad ka hawlgasho." };
        }

        const bioText = (formData.bio || "").trim();
        const aboutText = (formData.about || "").trim();
        const locationText = (formData.location || "").trim();
        const waNumber = (formData.whatsapp_number || "").trim();

        if (bioText.length > 160) {
            return { error: "Bio-ga Ganacigu kama badnaan karo 160 xaraf." };
        }
        if (aboutText.length > 1000) {
            return { error: "Faahfaahinta Ganacsigu (About) kama badnaan karto 1000 xaraf." };
        }

        const { error } = await supabase
            .from("stores")
            .update({
                name: storeName,
                whatsapp_number: waNumber,
                city_ids: formData.city_ids,
                city_id: formData.city_ids[0] || null,
                category_id: formData.category_id || null,
                location: locationText || null,
                bio: bioText || null,
                about: aboutText || null,
            })
            .eq("owner_id", user.id);

        if (error) {
            return { error: "Khalad: " + error.message };
        }

        revalidatePath("/store/settings");
        revalidatePath("/store");
        return { success: true, message: "Xogta Ganaciga si guul leh ayaa loo cusboonaysiiyay!" };
    } catch (err: any) {
        return { error: err?.message || "Khalad lama filaan ah ayaa dhacay." };
    }
}

// 2. Cusboonaysii Sawirrada Dukaanka (Logo & Banner)
// 2. Cusboonaysii ama Tirtir Sawirrada Dukaanka (Logo & Banner)
export async function updateStoreBrandingAction(branding: {
    logo_url?: string | null;
    back_logo_url?: string | null;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Fadlan soo gal nidaamka." };

    // Soo qaad sawirradii hore si loo tirtiro faylka Storage-ka haddii la beddelo ama null laga dhigo
    const { data: currentStore } = await supabase
        .from("stores")
        .select("logo_url, back_logo_url")
        .eq("owner_id", user.id)
        .single();

    if (currentStore) {
        const filesToDelete: string[] = [];
        
        // Haddii logo la beddelay ama null laga dhigay (la tirtiray)
        if (
            branding.logo_url !== undefined &&
            currentStore.logo_url &&
            branding.logo_url !== currentStore.logo_url
        ) {
            const p = extractStoragePath(currentStore.logo_url, "stores");
            if (p) filesToDelete.push(p);
        }

        // Haddii banner la beddelay ama null laga dhigay (la tirtiray)
        if (
            branding.back_logo_url !== undefined &&
            currentStore.back_logo_url &&
            branding.back_logo_url !== currentStore.back_logo_url
        ) {
            const p = extractStoragePath(currentStore.back_logo_url, "stores");
            if (p) filesToDelete.push(p);
        }

        if (filesToDelete.length > 0) {
            await supabase.storage.from("stores").remove(filesToDelete);
        }
    }

    const updateData: { logo_url?: string | null; back_logo_url?: string | null } = {};
    if (branding.logo_url !== undefined) updateData.logo_url = branding.logo_url;
    if (branding.back_logo_url !== undefined) updateData.back_logo_url = branding.back_logo_url;

    const { error } = await supabase
        .from("stores")
        .update(updateData)
        .eq("owner_id", user.id);

    if (error) {
        return { error: "Khalad ayaa dhacay markii la cusboonaysiinayay sawirka." };
    }

    revalidatePath("/store/settings");
    revalidatePath("/store");
    return { success: true, message: "Muuqaalka Ganacsiga si guul leh ayaa loo cusboonaysiiyay!" };
}

// 3. Tirtir Dukaanka + Sawirradiisa
export async function deleteStoreAction() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Fadlan soo gal nidaamka." };

    const { data: store } = await supabase
        .from("stores")
        .select("id, logo_url, back_logo_url")
        .eq("owner_id", user.id)
        .single();

    if (!store) {
        return { error: "Ganacsi lama helin." };
    }

    const storeFilesToDelete: string[] = [];
    if (store.logo_url) {
        const p = extractStoragePath(store.logo_url, "stores");
        if (p) storeFilesToDelete.push(p);
    }
    if (store.back_logo_url) {
        const p = extractStoragePath(store.back_logo_url, "stores");
        if (p) storeFilesToDelete.push(p);
    }
    if (storeFilesToDelete.length > 0) {
        await supabase.storage.from("stores").remove(storeFilesToDelete);
    }

    const { data: storeProducts } = await supabase
        .from("products")
        .select("image")
        .eq("store_id", store.id);

    if (storeProducts && storeProducts.length > 0) {
        const productFilesToDelete: string[] = [];
        for (const prod of storeProducts) {
            if (prod.image) {
                const p = extractStoragePath(prod.image, "products");
                if (p) productFilesToDelete.push(p);
            }
        }
        if (productFilesToDelete.length > 0) {
            await supabase.storage.from("products").remove(productFilesToDelete);
        }
    }

    const { error } = await supabase.from("stores").delete().eq("id", store.id);

    if (error) {
        return {
            error: "Ma suurtogelin in Ganacsiga la tirtiro. Fadlan isku day markale.",
        };
    }

    revalidatePath("/", "layout");
    return { success: true };
}