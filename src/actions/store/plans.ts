"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface SubmitPaymentInput {
    planId: string;
    paymentMethod: string;
    senderPhone: string;
}

export async function submitPaymentAction(data: SubmitPaymentInput) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Fadlan marka hore soo gal." };
    }

    // Hel dukaanka isticmaalaha
    const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (storeError || !store) {
        return { success: false, error: "Ganacsigan lama helin." };
    }

    // Xaqiiji qorshaha la doortay
    const { data: plan, error: planError } = await supabase
        .from("plans")
        .select("id, price")
        .eq("id", data.planId)
        .single();

    if (planError || !plan) {
        return { success: false, error: "Xirmo la doortay ma jiro." };
    }

    // Hubi haddii uu jiro payment weli 'pending' ah oo qofku hore u soo diray
    const { data: existingPending } = await supabase
        .from("payments")
        .select("id")
        .eq("store_id", store.id)
        .eq("status", "pending")
        .limit(1);

    if (existingPending && existingPending.length > 0) {
        return {
            success: false,
            error: "Waxaad horey u dirtay dalab lacag-bixin ah oo weli sugitaan ku jira. Fadlan sug inta systemka ka hubinayo.",
        };
    }

    // Geli miiska payments xogta
    const { error: insertError } = await supabase.from("payments").insert({
        store_id: store.id,
        plan_id: plan.id,
        amount: plan.price,
        payment_method: data.paymentMethod,
        sender_phone: data.senderPhone.trim(),
        status: "pending",
    });

    if (insertError) {
        return { success: false, error: "Khalad ayaa dhacay markii la dirayay dalabka: " + insertError.message };
    }

    revalidatePath("/store/plans");
    revalidatePath("/store/billing");
    return { success: true };
}