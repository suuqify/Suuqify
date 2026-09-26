"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface AdminPaymentRecord {
    id: string;
    amount: number;
    paymentMethod: string;
    senderPhone: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    store: {
        id: string;
        name: string;
        whatsappNumber: string;
        status: string;
        city: string;
        category: string;
        owner: {
            fullName: string;
            phoneNumber: string;
        };
    };
    plan: {
        id: string;
        name: string;
        price: number;
        duration: number;
        maxProduct: number;
    };
}

export interface GetPaymentsParams {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export async function getAdminPaymentsAction(params: GetPaymentsParams) {
    try {
        const supabase = await createClient();
        const page = params.page || 1;
        const limit = params.limit || 10;
        const offset = (page - 1) * limit;

        let query = supabase
            .from("payments")
            .select(
                `
        id,
        amount,
        payment_method,
        sender_phone,
        status,
        created_at,
        stores (
          id,
          name,
          whatsapp_number,
          status,
          cities ( name ),
          categories ( name ),
          profiles (
            full_name,
            phone_number
          )
        ),
        plans (
          id,
          name,
          price,
          duration,
          max_product
        )
      `,
                { count: "exact" }
            )
            .order("created_at", { ascending: false });

        // Status Filter
        if (params.status && params.status !== "all") {
            query = query.eq("status", params.status);
        }

        // Search by sender phone
        if (params.search) {
            query = query.ilike("sender_phone", `%${params.search}%`);
        }

        const { data, count, error } = await query.range(offset, offset + limit - 1);

        if (error) throw error;

        const payments: AdminPaymentRecord[] = (data || []).map((p: any) => ({
            id: p.id,
            amount: Number(p.amount) || 0,
            paymentMethod: p.payment_method || "EVC Plus",
            senderPhone: p.sender_phone || "N/A",
            status: p.status,
            createdAt: p.created_at,
            store: {
                id: p.stores?.id || "",
                name: p.stores?.name || "Deleted Store",
                whatsappNumber: p.stores?.whatsapp_number || "",
                status: p.stores?.status || "",
                city: p.stores?.cities?.name || "N/A",
                category: p.stores?.categories?.name || "N/A",
                owner: {
                    fullName: p.stores?.profiles?.full_name || "N/A",
                    phoneNumber: p.stores?.profiles?.phone_number || "N/A",
                },
            },
            plan: {
                id: p.plans?.id || "",
                name: p.plans?.name || "N/A",
                price: Number(p.plans?.price) || 0,
                duration: p.plans?.duration || 0,
                maxProduct: p.plans?.max_product || 0,
            },
        }));

        return {
            success: true,
            payments,
            totalCount: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
            currentPage: page,
        };
    } catch (err: any) {
        console.error("Get Admin Payments Error:", err);
        return { success: false, error: "Could not fetch payment requests." };
    }
}

// 1. Approve Payment Server Action (RPC Call)
export async function approvePaymentAction(paymentId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc("approve_payment", {
            p_payment_id: paymentId,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        if (!data?.success) {
            return { success: false, error: data?.error || "Approval failed" };
        }

        revalidatePath("/admin/payments");
        revalidatePath("/admin/billing");
        revalidatePath("/admin");
        return { success: true, message: "Payment approved and store subscription activated!" };
    } catch (err: any) {
        console.error("Approve Action Error:", err);
        return { success: false, error: "Failed to approve payment." };
    }
}

// 2. Reject Payment Server Action (RPC Call)
export async function rejectPaymentAction(paymentId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc("reject_payment", {
            p_payment_id: paymentId,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        if (!data?.success) {
            return { success: false, error: data?.error || "Rejection failed" };
        }

        revalidatePath("/admin/payments");
        revalidatePath("/admin");
        return { success: true, message: "Payment has been rejected." };
    } catch (err: any) {
        console.error("Reject Action Error:", err);
        return { success: false, error: "Failed to reject payment." };
    }
}