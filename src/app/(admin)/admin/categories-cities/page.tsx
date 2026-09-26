import { Metadata } from "next";
import { getAdminCategoriesCities } from "@/actions/admin/categories-cities";
import { TaxonomyView } from "@/components/admin/categories-cities/categories-cities-view";

export const metadata: Metadata = {
    title: "Categories & Cities | Suuqify Admin",
    description: "Manage store categories and available operational cities",
};

export default async function AdminCategoriesCitiesPage() {
    const res = await getAdminCategoriesCities();

    return (
        <TaxonomyView
            categories={res.categories || []}
            cities={res.cities || []}
        />
    );
}