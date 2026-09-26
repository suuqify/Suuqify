// src/app/(admin)/admin/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        redirect("/store");
    }

    return (
        <AdminLayoutClient adminName={profile.full_name || "Admin"}>
            {children}
        </AdminLayoutClient>
    );
}