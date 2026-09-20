"use server";

import { createClient } from "@/utils/supabase/server";
import { BillingResponse, PaymentItem } from "@/components/store/billing/types";

export async function getStorePaymentsAction(page = 1, limit = 8): Promise<BillingResponse> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Awood uma lihid.");
    }

    // Hel dukaanka
    const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!store) {
        throw new Error("Dukaan lama helin.");
    }

    // 1. Soo qaado dhammaan payments si aan stats u xisaabino
    const { data: allPayments } = await supabase
        .from("payments")
        .select("amount, status")
        .eq("store_id", store.id);

    let totalSpent = 0;
    let approvedCount = 0;
    let pendingCount = 0;

    if (allPayments) {
        allPayments.forEach((p) => {
            if (p.status === "approved") {
                totalSpent += Number(p.amount) || 0;
                approvedCount += 1;
            } else if (p.status === "pending") {
                pendingCount += 1;
            }
        });
    }

    // 2. Pagination Fetching
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: payments, count, error } = await supabase
        .from("payments")
        .select(
            `
      id,
      amount,
      payment_method,
      sender_phone,
      status,
      created_at,
      plans (
        name,
        duration
      )
    `,
            { count: "exact" }
        )
        .eq("store_id", store.id)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Error fetching payments:", error);
        return {
            payments: [],
            totalCount: 0,
            currentPage: page,
            totalPages: 1,
            stats: { totalSpent: 0, approvedCount: 0, pendingCount: 0 },
        };
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
        payments: (payments as unknown as PaymentItem[]) || [],
        totalCount,
        currentPage: page,
        totalPages,
        stats: {
            totalSpent,
            approvedCount,
            pendingCount,
        },
    };
}