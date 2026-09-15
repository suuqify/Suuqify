"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOutAction } from "@/actions/auth";

interface StoreProps {
    store: {
        name: string;
        whatsapp_number: string;
        status: string;
    };
}

export function StoreOverview({ store }: StoreProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        if (loading) return;
        setLoading(true);

        const toastId = toast.loading("Waad ka baxaysaa...");

        try {
            await signOutAction();
            toast.success("Si guul leh ayaad uga baxday!", {
                id: toastId,
                duration: 2000,
            });

            router.push("/signin");
            router.refresh();
        } catch {
            toast.error("Qalad ayaa dhacay xilliga ka bixitaanka.", {
                id: toastId,
                duration: 3000,
            });
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-xs">
                <div>
                    <h1 className="text-xl font-bold">{store.name}</h1>
                    <p className="text-sm text-muted-foreground">WhatsApp: {store.whatsapp_number}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground capitalize">
                        {store.status}
                    </span>
                    <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted disabled:opacity-50"
                    >
                        {loading ? "Fadlan sug..." : "Ka bax"}
                    </button>
                </div>
            </div>
        </div>
    );
}