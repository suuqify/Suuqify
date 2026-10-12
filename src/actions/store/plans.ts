"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface SubmitPaymentInput {
    planId: string;
    paymentMethod: string;
    senderPhone: string;
}

export async function submitPaymentAction(data: SubmitPaymentInput) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Fadlan marka hore soo gal." };
        }

        const { data: store, error: storeError } = await supabase
            .from("stores")
            .select("id")
            .eq("owner_id", user.id)
            .single();

        if (storeError || !store) {
            return { success: false, error: "Ganacsigan lama helin." };
        }

        const { data: plan, error: planError } = await supabase
            .from("plans")
            .select("id, price")
            .eq("id", data.planId)
            .single();

        if (planError || !plan) {
            return { success: false, error: "Xirmo la doortay ma jiro." };
        }

        const { data: existingPending } = await supabase
            .from("payments")
            .select("id")
            .eq("store_id", store.id)
            .eq("status", "pending")
            .limit(1);

        if (existingPending && existingPending.length > 0) {
            return {
                success: false,
                error: "Waxaad horey u dirtay dalab lacag-bixin ah oo weli sugitaan ku jira. Fadlan sug inta maamulku ka hubinayo.",
            };
        }

        const { error: insertError } = await supabase.from("payments").insert({
            store_id: store.id,
            plan_id: plan.id,
            amount: plan.price,
            payment_method: data.paymentMethod,
            sender_phone: data.senderPhone.trim(),
            status: "pending",
        });

        if (insertError) {
            return { success: false, error: "Khalad: " + insertError.message };
        }

        revalidatePath("/store/plans");
        revalidatePath("/store/billing");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err?.message || "Khalad aan la filayn ayaa dhacay." };
    }
}

// 2. Toos u hawlgeli Qorshaha Bilaashka ah ($0 Free Trial)
export async function claimFreeTrialAction(planId: string) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Fadlan soo gal nidaamka." };

        // 1. Hel Dukaanka
        const { data: store, error: storeError } = await supabase
            .from("stores")
            .select("id, status")
            .eq("owner_id", user.id)
            .single();

        if (storeError || !store) return { success: false, error: "Dukaan lama helin." };

        // 2. Hubi Xirmada
        const { data: plan, error: planError } = await supabase
            .from("plans")
            .select("id, name, price, duration")
            .eq("id", planId)
            .single();

        if (planError || !plan) return { success: false, error: "Xirmada lama helin." };

        if (Number(plan.price) > 0) {
            return { success: false, error: "Xirmadani maahan bilaash, fadlan lacagteeda bixi." };
        }

        // 3. Hubi haddii dukaanku horey u soo qaatay Free Trial
        const { data: previousSubs } = await supabase
            .from("subscriptions")
            .select(`
                id,
                plans (
                    price
                )
            `)
            .eq("store_id", store.id);

        const hasUsedTrial = (previousSubs || []).some((s: any) => Number(s.plans?.price) === 0);

        if (hasUsedTrial) {
            return {
                success: false,
                error: "Horay ayaad u isticmaashay fursadda tijaabada bilaashka ah (Free Trial). Fadlan dooro mid ka mid ah xirmooyinka rasmiga ah.",
            };
        }

        // 4. Xisaabi muddada
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + (Number(plan.duration) || 7));

        // 5. Geli miiska subscriptions
        const { error: subError } = await supabase.from("subscriptions").insert({
            store_id: store.id,
            plan_id: plan.id,
            status: "active",
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
        });

        if (subError) {
            return { success: false, error: "DB Error: " + subError.message };
        }

        // 6. Dukaanka ka dhig Active hadduu ahaa pending
        await supabase
            .from("stores")
            .update({ status: "active" })
            .eq("id", store.id);

        revalidatePath("/store/plans");
        revalidatePath("/store/subscription");
        revalidatePath("/store");

        return { 
            success: true, 
            message: `Hambalyo! Waxaad si guul leh u bilowday ${plan.name} (${plan.duration} Maalmood).` 
        };
    } catch (err: any) {
        return { success: false, error: err?.message || "Khalad ayaa dhacay markii la hawlgelinayay tijaabada." };
    }
}