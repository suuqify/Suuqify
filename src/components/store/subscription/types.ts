export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    duration: number;
    max_product: number;
    is_feature: boolean;
}

export interface CurrentSubscription {
    id: string;
    status: "active" | "expired";
    start_date: string;
    end_date: string;
    plan: SubscriptionPlan;
}

export interface PastSubscription {
    id: string;
    status: string;
    start_date: string;
    end_date: string;
    plan: {
        name: string;
        price: number;
    } | null;
}

export interface SubscriptionViewData {
    currentSub: CurrentSubscription | null;
    productCount: number;
    pastSubscriptions: PastSubscription[];
}