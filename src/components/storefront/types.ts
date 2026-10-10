export interface ProductOption {
    name: string;
    values: string[];
}

export interface StorefrontProduct {
    id: string;
    name: string;
    price: number;
    description?: string | null;
    image: string | null;
    options?: ProductOption[] | any;
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
    city_ids?: string[];
    city?: { name: string } | null;
    cities?: { id?: string; name: string }[];
    category?: { name: string } | null;
    is_verified: boolean;
    status: string;
    products: StorefrontProduct[];
}