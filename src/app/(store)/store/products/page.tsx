import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
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
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    // 1. Hel Dukaanka iyo Category-giisa
    const { data: store } = await supabase
        .from("stores")
        .select(`
            id,
            categories (
                name
            )
        `)
        .eq("owner_id", user.id)
        .single();

    if (!store) {
        redirect("/onboarding");
    }

    const categoryName = (store?.categories as unknown as { name: string } | null)?.name || undefined;

    // 2. Soo qaado xadka alaabta (max_product) ee qorshaha hadda u socda
    const { data: subscription } = await supabase
        .from("subscriptions")
        .select(`
            status,
            end_date,
            plans (
                max_product
            )
        `)
        .eq("store_id", store.id)
        .eq("status", "active")
        .order("end_date", { ascending: false })
        .limit(1)
        .maybeSingle();

    const now = new Date();
    const isSubActive = subscription && new Date(subscription.end_date) > now;

    const planData = subscription?.plans as unknown as { max_product: number } | null;

    // HADDII UU LEEYAHAY: waa max_product-ka qorshaha, HADDII KALENA: WAA 0!
    const maxLimit = isSubActive && planData ? planData.max_product : 0;

    // 3. Soo qaado xogta alaabta pagination ahaan (limit: 10 halkii bog)
    const resolvedParams = await searchParams;
    const page = typeof resolvedParams?.page === "string" ? parseInt(resolvedParams.page) : 1;
    const productsData = await getStoreProductsAction(page, 10);

    return (
        <div className="max-w-6xl w-full mx-auto">
            <ProductsView
                initialData={productsData}
                maxLimit={maxLimit}
                categoryName={categoryName}
            />
        </div>
    );
}