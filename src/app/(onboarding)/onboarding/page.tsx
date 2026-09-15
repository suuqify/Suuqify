import { Metadata } from "next";
import { getActiveCities, getActiveCategories } from "@/actions/onboarding";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export const metadata: Metadata = {
    title: "Dhis Dukaankaaga - Suuqify",
    description: "Buuxi xogta aasaasiga ah si aad u furato dukaankaaga cusub.",
};

export default async function OnboardingPage() {
    const [cities, categories] = await Promise.all([
        getActiveCities(),
        getActiveCategories(),
    ]);

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-xl font-bold">Aasaas Dukaankaaga</h1>
                <p className="text-xs text-muted-foreground">Kaliya hal daqiiqo ayaa kugu filan</p>
            </div>
            <OnboardingForm cities={cities} categories={categories} />
        </div>
    );
}