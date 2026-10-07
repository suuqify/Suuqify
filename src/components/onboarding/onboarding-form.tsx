"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStoreAction } from "@/actions/onboarding";
import { MapPin, Check } from "lucide-react";

interface Props {
    cities: { id: string; name: string }[];
    categories: { id: string; name: string }[];
}

export function OnboardingForm({ cities, categories }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);

    const toggleCity = (cityId: string) => {
        setSelectedCities((prev) =>
            prev.includes(cityId)
                ? prev.filter((id) => id !== cityId)
                : [...prev, cityId]
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedCities.length === 0) {
            toast.error("Fadlan dooro ugu yaraan hal magaalo!");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Dhisidda Ganacsigaaga...");
        const formData = new FormData(e.currentTarget);

        // Ku dar dhammaan magaalooyinka la doortay formData
        selectedCities.forEach((id) => formData.append("city_ids", id));

        try {
            const result = await createStoreAction(formData);

            if (result?.error) {
                toast.error(result.error, { id: toastId, duration: 4000 });
                setLoading(false);
            } else if (result?.success) {
                toast.success("Hambalyo! Ganacsigaaga si guul leh ayaa loo dhisay.", {
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
                    Magaca Ganacsigaaga *
                </label>
                <input
                    name="name"
                    required
                    placeholder="tusaale: SomStyle"
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-ring focus:ring-2 focus:ring-primary/20"
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
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-ring focus:ring-2 focus:ring-primary/20"
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
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-ring focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* Qaybta Ganacsiga */}
            <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase">
                    Nooca Ganacsiga (Qaybta) *
                </label>
                <select
                    name="category_id"
                    required
                    defaultValue=""
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-ring focus:ring-2 focus:ring-primary/20"
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

            {/* Magaalooyinka Ganacsigu Ka Hawlgalo (Multi-Select) */}
            <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase">
                        Magaalooyinka aad Xarumo ku leedahay *
                    </label>
                    <span className="text-[11px] text-primary font-medium">
                        (Dooro hal ama ka badan)
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                    {cities.map((city) => {
                        const isSelected = selectedCities.includes(city.id);
                        return (
                            <button
                                key={city.id}
                                type="button"
                                onClick={() => toggleCity(city.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer select-none ${isSelected
                                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                        : "bg-muted/40 text-foreground border-border/70 hover:bg-muted"
                                    }`}
                            >
                                <MapPin className={`h-3 w-3 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                <span>{city.name}</span>
                                {isSelected && <Check className="h-3.5 w-3.5 ml-0.5" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
                {loading ? "Fadlan sug..." : "Dhis Ganacsigayga"}
            </button>
        </form>
    );
}