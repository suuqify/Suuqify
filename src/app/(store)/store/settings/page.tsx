import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SettingsView } from "@/components/store/settings/settings-view";

export const metadata: Metadata = {
    title: "Qaabeynta Dukaanka | Suuqify",
    description: "Wax ka beddel macluumaadka, sawirrada, iyo amniga dukaankaaga.",
};

export default async function SettingsPage() {
    const supabase = await createClient();

    // 1. Hubi qofka soo galay
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    // 2. Soo saar dukaanka, magaalooyinka, iyo qaybaha si siman (Parallel)
    const [storeRes, citiesRes, categoriesRes] = await Promise.all([
        supabase
            .from("stores")
            .select("*")
            .eq("owner_id", user.id)
            .single(),
        supabase
            .from("cities")
            .select("id, name")
            .eq("is_active", true)
            .order("name", { ascending: true }),
        supabase
            .from("categories")
            .select("id, name")
            .eq("is_active", true)
            .order("name", { ascending: true }),
    ]);

    if (!storeRes.data) {
        redirect("/onboarding");
    }

    return (
        <SettingsView
            store={storeRes.data}
            userEmail={user.email || ""}
            cities={citiesRes.data || []}
            categories={categoriesRes.data || []}
        />
    );
}