import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StoreSidebar } from "@/components/store/store-sidebar";
import { StoreHeader } from "@/components/store/store-header";

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

    const { data: store } = await supabase
        .from("stores")
        .select("id, name, status")
        .eq("owner_id", user.id)
        .single();

    if (!store) {
        redirect("/onboarding");
    }

    return (
        <SidebarProvider>
            <StoreSidebar storeName={store.name} />

            <SidebarInset className="min-w-0">
                <StoreHeader storeName={store.name} status={store.status} />
                <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}