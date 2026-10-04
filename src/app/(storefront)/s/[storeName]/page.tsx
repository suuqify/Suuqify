import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { StoreNotFound } from "@/components/storefront/store-not-found";
import { StorefrontView } from "@/components/storefront/storefront-view";
import { StorefrontData, StorefrontProduct } from "@/components/storefront/types";

interface StorefrontPageProps {
    params: Promise<{ storeName: string }>;
}

export async function generateMetadata({ params }: StorefrontPageProps): Promise<Metadata> {
    const { storeName } = await params;
    const decodedName = decodeURIComponent(storeName);

    return {
        title: `${decodedName} | Dukaanka Online-ka ah ee Suuqify`,
        description: `Ka iibso alaab tayo leh dukaanka ${decodedName} adigoo toos uga dalbanaya WhatsApp.`,
    };
}

export default async function StorefrontPage({ params }: StorefrontPageProps) {
    const { storeName } = await params;
    const decodedName = decodeURIComponent(storeName);

    const supabase = await createClient();

    // 1. Soo qaado dukaanka
    const { data: store, error } = await supabase
        .from("stores")
        .select(`
            id,
            name,
            whatsapp_number,
            logo_url,
            back_logo_url,
            bio,
            about,
            location,
            city_ids,
            is_verified,
            status,
            city:cities(name),
            category:categories(name)
        `)
        .ilike("name", decodedName)
        .maybeSingle();

    if (error || !store) {
        return <StoreNotFound title="Dukaankan Lama Helin" message={`Ma jiro dukaan magaciisu yahay "${decodedName}".`} />;
    }

    if (store.status !== "active") {
        return (
            <StoreNotFound
                title="Dukaanku Hadda Ma Shaqaynayo"
                message={`Dukaanka "${store.name}" dib-u-eegis ayaa ku socota ama si ku-meel-gaar ah ayaa loo hakiyay.`}
            />
        );
    }

    // 2. Hubi Subscription-ka
    const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, end_date")
        .eq("store_id", store.id)
        .eq("status", "active")
        .order("end_date", { ascending: false })
        .limit(1)
        .maybeSingle();

    const hasActiveSub = sub && new Date(sub.end_date) > new Date();

    if (!hasActiveSub) {
        return (
            <StoreNotFound
                title="Dukaanku Waa Xiran Yahay"
                message={`Dukaanka "${store.name}" heshiiskii uu ku shaqaynayay wuu dhacay. Fadlan dib ugu soo laabo goor dhow.`}
            />
        );
    }

    // 3. Soo qaado Magaalooyinka Badan (Multi-city resolution)
    let storeCities: { id: string; name: string }[] = [];
    if (store.city_ids && store.city_ids.length > 0) {
        const { data: citiesData } = await supabase
            .from("cities")
            .select("id, name")
            .in("id", store.city_ids);
        storeCities = citiesData || [];
    } else if (store.city) {
        storeCities = [store.city as any];
    }

    // 4. Soo qaado alaabta
    const { data: products } = await supabase
        .from("products")
        .select("id, name, price, image, options, in_stock, created_at")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });

    const storefrontData: any = {
        ...store,
        cities: storeCities,
        category: store.category,
        products: (products as unknown as StorefrontProduct[]) || [],
    };

    return <StorefrontView store={storefrontData} />;
}