import { Metadata } from "next";
import { getStoreProductsAction } from "@/actions/store/products/get-products";
import { ProductsView } from "@/components/store/products/product-view";

export const metadata: Metadata = {
    title: "Maamulka Alaabta | Suuqify",
    description: "Kudar, wax ka beddel ama tirtir alaabta dukaankaaga ee Suuqify.",
};

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const resolvedParams = await searchParams;
    const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1;

    // Soo qaado xogta SSR ahaan iyadoo loo marayo Server Action
    const productsData = await getStoreProductsAction(page, 2);

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <ProductsView initialData={productsData} />
        </div>
    );
}