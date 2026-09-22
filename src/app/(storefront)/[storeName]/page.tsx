// src/app/(storefront)/[storeName]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
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

    // 1. Soo qaado dukaanka (case-insensitive search)
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

    // 2. Hubi Xaaladda Dukaanka (Waa inuu active yahay)
    if (store.status !== "active") {
        return (
            <StoreNotFound
                title="Dukaanku Hadda Ma Shaqaynayo"
                message={`Dukaanka "${store.name}" dib-u-eegis ayaa ku socota ama si ku-meel-gaar ah ayaa loo hakiyay.`}
            />
        );
    }

    // 3. Hubi Subscription-ka Dukaanka (Waa inuu leeyahay heshiis firfircoon)
    const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, end_date")
        .eq("store_id", store.id)
        .eq("status", "active")
        .order("end_date", { ascending: false })
        .limit(1)
        .maybeSingle();

    const now = new Date();
    const hasActiveSub = sub && new Date(sub.end_date) > now;

    if (!hasActiveSub) {
        return (
            <StoreNotFound
                title="Dukaanku Waa Xiran Yahay"
                message={`Dukaanka "${store.name}" heshiiskii uu ku shaqaynayay wuu dhacay. Fadlan dib ugu soo laabo goor dhow.`}
            />
        );
    }

    // 4. Soo qaado dhammaan alaabta dukaanka
    const { data: products } = await supabase
        .from("products")
        .select("id, name, price, image, options, in_stock, created_at")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });

    const storefrontData: StorefrontData = {
        ...store,
        city: store.city as unknown as { name: string } | null,
        category: store.category as unknown as { name: string } | null,
        products: (products as unknown as StorefrontProduct[]) || [],
    };

    return <StorefrontView store={storefrontData} />;
}