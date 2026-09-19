export interface ProductOption {
    name: string;
    values: string[];
}

export interface Product {
    id: string;
    store_id: string;
    name: string;
    price: number;
    image: string | null;
    options: ProductOption[];
    in_stock: boolean;
    created_at: string;
}

export interface ProductsResponse {
    products: Product[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}