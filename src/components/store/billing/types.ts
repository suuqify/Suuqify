export interface PaymentItem {
    id: string;
    amount: number;
    payment_method: string;
    sender_phone: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    plans: {
        name: string;
        duration: number;
    } | null;
}

export interface BillingResponse {
    payments: PaymentItem[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    stats: {
        totalSpent: number;
        approvedCount: number;
        pendingCount: number;
    };
}