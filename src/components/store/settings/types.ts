export interface City {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface StoreData {
    id: string;
    name: string;
    whatsapp_number: string;
    logo_url: string | null;
    back_logo_url: string | null;
    bio: string | null;
    about: string | null;
    location: string | null;
    city_id: string | null;
    category_id: string | null;
    status: string;
}