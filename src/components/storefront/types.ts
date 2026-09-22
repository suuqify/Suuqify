export interface StorefrontOption {
    name: string;
    values: string[];
}

export interface StorefrontProduct {
    id: string;
    name: string;
    price: number;
    image: string | null;
    options: StorefrontOption[];
    in_stock: boolean;
    created_at: string;
}

export interface StorefrontData {
    id: string;
    name: string;
    whatsapp_number: string;
    logo_url: string | null;
    back_logo_url: string | null;
    bio: string | null;
    about: string | null;
    location: string | null;
    is_verified: boolean;
    status: "pending" | "active" | "suspended";
    city: { name: string } | null;
    category: { name: string } | null;
    products: StorefrontProduct[];
}