// src/app/(admin)/admin/plans/page.tsx
import { Metadata } from "next";
import { getAdminPlansAction } from "@/actions/admin/plans";
import { PlansView } from "@/components/admin/plans/plans-view";

export const metadata: Metadata = {
    title: "Plans Management | Suuqify Admin",
    description: "Manage subscription plans, limits and pricing",
};

export default async function AdminPlansPage() {
    const res = await getAdminPlansAction();

    return <PlansView plans={res.plans || []} />;
}