import { Metadata } from "next";
import { GoogleButton } from "@/components/auth/google-button";

export const metadata: Metadata = {
    title: "Soo Gal - Suuqify",
    description: "Ku gal koontadaada Suuqify adoo isticmaalaya Google.",
};

export default function SignInPage() {
    return (
        <div className="space-y-6 text-center">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Ku soo dhowaw Suuqify</h1>
                <p className="text-sm text-muted-foreground">Ku maamul dukaankaaga hab casri ah</p>
            </div>
            <GoogleButton />
        </div>
    );
}