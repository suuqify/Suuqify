"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStoreAction } from "@/actions/onboarding";

interface Props {
    cities: { id: string; name: string }[];
    categories: { id: string; name: string }[];
}

export function OnboardingForm({ cities, categories }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading("Dhisidda dukaanka...");
        const formData = new FormData(e.currentTarget);

        try {
            const result = await createStoreAction(formData);

            if (result?.error) {
                toast.error(result.error, { id: toastId, duration: 4000 });
                setLoading(false);
            } else if (result?.success) {
                toast.success("Hambalyo! Dukaankaaga si guul leh ayaa loo dhisay.", {
                    id: toastId,
                    duration: 3000,
                });
                router.push("/store");
                router.refresh();
            }
        } catch {
            toast.error("Qalad lama filaan ah ayaa dhacay.", { id: toastId, duration: 4000 });
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase">
                    Magaca Dukaanka *
                </label>
                <input
                    name="name"
                    required
                    placeholder="tusaale: SomStyle"
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-ring focus:ring-1"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase">
                    WhatsApp Lambarka Dalabka *
                </label>
                <input
                    name="whatsapp_number"
                    required
                    placeholder="25261xxxxxxx"
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-ring focus:ring-1"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase">
                    Lambarkaaga Gaarka ah *
                </label>
                <input
                    name="phone_number"
                    required
                    placeholder="25261xxxxxxx"
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-ring focus:ring-1"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase">
                        Magaalada *
                    </label>
                    <select
                        name="city_id"
                        required
                        defaultValue=""
                        className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-ring focus:ring-1"
                    >
                        <option value="" disabled className="text-muted-foreground bg-card">
                            {cities.length === 0 ? "Magaalo lama helin" : "Dooro Magaalo"}
                        </option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id} className="text-foreground bg-card">
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase">
                        Qaybta *
                    </label>
                    <select
                        name="category_id"
                        required
                        defaultValue=""
                        className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-ring focus:ring-1"
                    >
                        <option value="" disabled className="text-muted-foreground bg-card">
                            {categories.length === 0 ? "Qayb lama helin" : "Dooro Qayb"}
                        </option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="text-foreground bg-card">
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-xs transition hover:opacity-90 disabled:opacity-50"
            >
                {loading ? "Fadlan sug..." : "Dhis Dukaankayga"}
            </button>
        </form>
    );
}