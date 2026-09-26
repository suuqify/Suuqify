"use server";

import { createClient } from "@/utils/supabase/server";

export interface BillingTransactionItem {
    id: string;
    amount: number;
    paymentMethod: string;
    senderPhone: string;
    createdAt: string;
    storeName: string;
    storeWhatsapp: string;
    ownerName: string;
    planName: string;
    planDuration: number;
}

export interface BillingStats {
    totalRevenue: number;
    thisMonthRevenue: number;
    totalTransactions: number;
    methodBreakdown: {
        evc: number;
        zaad: number;
        sahal: number;
        edahab: number;
    };
}

export async function getAdminBillingAction(params: { page?: number; limit?: number }) {
    try {
        const supabase = await createClient();
        const page = params.page || 1;
        const limit = params.limit || 12;
        const offset = (page - 1) * limit;

        // 1. Fetch All Approved Payments for Stats
        const { data: allApproved } = await supabase
            .from("payments")
            .select("amount, payment_method, created_at")
            .eq("status", "approved");

        const totalRevenue = (allApproved || []).reduce(
            (sum, p) => sum + (Number(p.amount) || 0),
            0
        );

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const thisMonthRevenue = (allApproved || [])
            .filter((p) => {
                const d = new Date(p.created_at);
                return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
            })
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        const methodBreakdown = {
            evc: 0,
            zaad: 0,
            sahal: 0,
            edahab: 0,
        };

        (allApproved || []).forEach((p) => {
            const method = (p.payment_method || "").toLowerCase();
            const amt = Number(p.amount) || 0;
            if (method.includes("evc")) methodBreakdown.evc += amt;
            else if (method.includes("zaad")) methodBreakdown.zaad += amt;
            else if (method.includes("sahal")) methodBreakdown.sahal += amt;
            else if (method.includes("edahab")) methodBreakdown.edahab += amt;
        });

        // 2. Fetch Paginated Approved Transactions
        const { data, count, error } = await supabase
            .from("payments")
            .select(
                `
        id,
        amount,
        payment_method,
        sender_phone,
        created_at,
        stores (
          name,
          whatsapp_number,
          profiles ( full_name )
        ),
        plans (
          name,
          duration
        )
      `,
                { count: "exact" }
            )
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        const transactions: BillingTransactionItem[] = (data || []).map((t: any) => ({
            id: t.id,
            amount: Number(t.amount) || 0,
            paymentMethod: t.payment_method || "EVC Plus",
            senderPhone: t.sender_phone || "N/A",
            createdAt: t.created_at,
            storeName: t.stores?.name || "Deleted Store",
            storeWhatsapp: t.stores?.whatsapp_number || "N/A",
            ownerName: t.stores?.profiles?.full_name || "N/A",
            planName: t.plans?.name || "N/A",
            planDuration: t.plans?.duration || 30,
        }));

        return {
            success: true,
            stats: {
                totalRevenue,
                thisMonthRevenue,
                totalTransactions: count || 0,
                methodBreakdown,
            },
            transactions,
            totalCount: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
            currentPage: page,
        };
    } catch (err: any) {
        console.error("Get Admin Billing Error:", err);
        return { success: false, error: "Could not fetch billing history." };
    }
}