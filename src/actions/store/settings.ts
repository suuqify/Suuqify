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
        return {
            error: `Magaca "${storeName}" horey ayaa loo qaatay. Fadlan dooro magac kale.`,
        };
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

    // Soo qaad sawirradii hore si haddii cusub la geliyo kuwii hore loo tirtiro
    const { data: currentStore } = await supabase
        .from("stores")
        .select("logo_url, back_logo_url")
        .eq("owner_id", user.id)
        .single();

    if (currentStore) {
        const filesToDelete: string[] = [];
        if (
            branding.logo_url &&
            currentStore.logo_url &&
            branding.logo_url !== currentStore.logo_url
        ) {
            const p = extractStoragePath(currentStore.logo_url, "stores");
            if (p) filesToDelete.push(p);
        }
        if (
            branding.back_logo_url &&
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

    const { error } = await supabase
        .from("stores")
        .update({
            ...(branding.logo_url !== undefined && { logo_url: branding.logo_url }),
            ...(branding.back_logo_url !== undefined && {
                back_logo_url: branding.back_logo_url,
            }),
        })
        .eq("owner_id", user.id);

    if (error) {
        return { error: "Khalad ayaa dhacay markii la kaydinayay sawirka." };
    }

    revalidatePath("/store/settings");
    revalidatePath("/store");
    return { success: true, message: "Sawirka dukaanka si guul leh ayaa loo beddelay!" };
}

// 3. Tirtir Dukaanka + Sawirradiisa (Store Branding & Dhammaan Products-ka)
export async function deleteStoreAction() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Fadlan soo gal nidaamka." };

    // 1. Hel dukaanka iyo sawirradiisa
    const { data: store } = await supabase
        .from("stores")
        .select("id, logo_url, back_logo_url")
        .eq("owner_id", user.id)
        .single();

    if (!store) {
        return { error: "Dukaan lama helin." };
    }

    // 2. Ka tirtir Logo & Banner bucket-ka 'stores'
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

    // 3. Hel dhammaan sawirrada alaabta dukaankan ka hor intaanan tirtirin
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

    // 4. Hadda tirtir dukaanka (alaabtiisa database-ka toos bay ugu tirtirmeysaa sababtoo ah ON DELETE CASCADE)
    const { error } = await supabase.from("stores").delete().eq("id", store.id);

    if (error) {
        return {
            error: "Ma suurtogelin in dukaanka la tirtiro. Fadlan isku day markale.",
        };
    }

    revalidatePath("/", "layout");
    return { success: true };
}