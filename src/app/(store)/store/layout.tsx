import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StoreSidebar } from "@/components/store/store-sidebar";
import { StoreHeader } from "@/components/store/store-header";
import { PendingStoreView } from "@/components/store/pending-store-view";
import { SubscriptionGuard } from "@/components/store/subscription-guard";

export default async function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    // 1. Hel Dukaanka
    const { data: store } = await supabase
        .from("stores")
        .select("id, name, status, is_verified")
        .eq("owner_id", user.id)
        .single();

    if (!store) {
        redirect("/onboarding");
    }

    // 2. Haddii dukaanku uusan active ahayn (Pending / Suspended)
    if (store.status !== "active") {
        return <PendingStoreView storeName={store.name} status={store.status} />;
    }

    // 3. Hubi Subscription-ka dukaanka
    const { data: currentSub } = await supabase
        .from("subscriptions")
        .select("status, end_date")
        .eq("store_id", store.id)
        .eq("status", "active")
        .order("end_date", { ascending: false })
        .limit(1)
        .maybeSingle();

    const now = new Date();
    const hasActiveSub = Boolean(currentSub && new Date(currentSub.end_date) > now);
    const isExpired = Boolean(currentSub && new Date(currentSub.end_date) <= now);

    return (
        <SidebarProvider>
            <StoreSidebar storeName={store.name} />
            <SidebarInset className="min-w-0">
                <StoreHeader storeName={store.name} status={store.status} />
                <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    <SubscriptionGuard
                        hasActiveSub={hasActiveSub}
                        isExpired={isExpired}
                        storeName={store.name}
                    >
                        {children}
                    </SubscriptionGuard>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}