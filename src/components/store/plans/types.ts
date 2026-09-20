export interface Plan {
    id: string;
    name: string;
    price: number;
    duration: number; 
    max_product: number;
    is_feature: boolean;
}

export interface ActiveSubscription {
    plan_id: string;
    status: string;
    end_date: string;
}