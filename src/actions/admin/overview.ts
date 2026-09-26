"use server";

import { createClient } from "@/utils/supabase/server";

export interface AdminOverviewStats {
    totalRevenue: number;
    pendingPaymentsCount: number;
    activeStoresCount: number;
    pendingStoresCount: number;
}

export interface RecentPaymentItem {
    id: string;
    storeName: string;
    planName: string;
    amount: number;
    paymentMethod: string;
    senderPhone: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

export interface RecentStoreItem {
    id: string;
    name: string;
    ownerName: string;
    cityName: string;
    categoryName: string;
    status: "pending" | "active" | "suspended";
    isVerified: boolean;
    createdAt: string;
}

export interface AdminOverviewData {
    stats: AdminOverviewStats;
    recentPayments: RecentPaymentItem[];
    recentStores: RecentStoreItem[];
}

export async function getAdminOverviewAction(): Promise<{
    success: boolean;
    data?: AdminOverviewData;
    error?: string;
}> {
    try {
        const supabase = await createClient();

        // 1. Hubi qofka soo galay inuu yahay Admin
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "Fadlan soo gal nidaamka marka hore." };
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== "admin") {
            return { success: false, error: "Uma lihid ogolaansho inaad gasho qaybtan." };
        }

        // 2. Xisaabi Dakhliga Approved-ka ah (Total Revenue)
        const { data: approvedPayments } = await supabase
            .from("payments")
            .select("amount")
            .eq("status", "approved");

        const totalRevenue = (approvedPayments || []).reduce(
            (sum, p) => sum + (Number(p.amount) || 0),
            0
        );

        // 3. Tirada Lacagaha Pending-ka ah
        const { count: pendingPaymentsCount } = await supabase
            .from("payments")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending");

        // 4. Tirada Dukaamada Active-ka ah
        const { count: activeStoresCount } = await supabase
            .from("stores")
            .select("*", { count: "exact", head: true })
            .eq("status", "active");

        // 5. Tirada Dukaamada Pending-ka ah
        const { count: pendingStoresCount } = await supabase
            .from("stores")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending");

        // 6. 5-tii Dalab ee ugu dambeeyay (Recent Payments)
        const { data: rawRecentPayments } = await supabase
            .from("payments")
            .select(`
        id,
        amount,
        payment_method,
        sender_phone,
        status,
        created_at,
        stores ( name ),
        plans ( name )
      `)
            .order("created_at", { ascending: false })
            .limit(5);

        const recentPayments: RecentPaymentItem[] = (rawRecentPayments || []).map((p: any) => ({
            id: p.id,
            storeName: p.stores?.name || "Dukaan la tirtiray",
            planName: p.plans?.name || "Qorshe la waayay",
            amount: Number(p.amount) || 0,
            paymentMethod: p.payment_method || "EVC Plus",
            senderPhone: p.sender_phone || "Lama yaqaan",
            status: p.status,
            createdAt: p.created_at,
        }));

        // 7. 5-tii Dukaan ee ugu dambeeyay (Recent Stores)
        const { data: rawRecentStores } = await supabase
            .from("stores")
            .select(`
        id,
        name,
        status,
        is_verified,
        created_at,
        profiles ( full_name ),
        cities ( name ),
        categories ( name )
      `)
            .order("created_at", { ascending: false })
            .limit(5);

        const recentStores: RecentStoreItem[] = (rawRecentStores || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            ownerName: s.profiles?.full_name || "Lama yaqaan",
            cityName: s.cities?.name || "Magaalo la'aan",
            categoryName: s.categories?.name || "Nooc la'aan",
            status: s.status,
            isVerified: Boolean(s.is_verified),
            createdAt: s.created_at,
        }));

        return {
            success: true,
            data: {
                stats: {
                    totalRevenue,
                    pendingPaymentsCount: pendingPaymentsCount || 0,
                    activeStoresCount: activeStoresCount || 0,
                    pendingStoresCount: pendingStoresCount || 0,
                },
                recentPayments,
                recentStores,
            },
        };
    } catch (err: any) {
        console.error("Admin Overview Error:", err);
        return { success: false, error: "Khalad ayaa dhacay marka xogta la soo qaadayay." };
    }
}