import React from "react";
import { MessageSquareCode, Smartphone, CreditCard, ShieldCheck, Zap, Layers } from "lucide-react";

export function FeaturesSection() {
    const features = [
        {
            icon: MessageSquareCode,
            title: "Dalab Hal Gujiso ah oo WhatsApp ah",
            desc: "Macmiilku marka uu doorto cabbirka iyo midabka, hal gujiso ayuu ku dirayaa fariin habaysan oo toos ugu furmaysa WhatsApp-kaaga.",
        },
        {
            icon: Smartphone,
            title: "Loogu Talagalay TikTok & Instagram",
            desc: "Link-gaaga dukaanka wuxuu si xawaare sare leh ugu furmayaa browser-ka gudaha ee Instagram iyo TikTok.",
        },
        {
            icon: CreditCard,
            title: "Lacag-bixinta Maxalliga ah",
            desc: "Ma jirto Master Card ama PayPal murugsan; heshiisyada waxaad ku bixinaysaa EVC Plus, Zaad, Sahal, iyo eDahab.",
        },
        {
            icon: Layers,
            title: "Doorashooyin Dynamic ah (Options)",
            desc: "Alaab kasta u yeel Midabbo, Cabbirro (S, M, L), ama GB iyadoo macmiilku si sahlan u dooran karo.",
        },
        {
            icon: Zap,
            title: "Xawaare Aad u Sarreeya",
            desc: "Ku dhisan Next.js 15 iyo Tailwind CSS v4 si dukaankaagu u furmo ilbiriqsi ka yar, meel kasta oo laga furo.",
        },
        {
            icon: ShieldCheck,
            title: "Calaamadda Verified-ka ee Rasmiga ah",
            desc: "Dhis kalsoonida macaamiishaada adigoo helaya calaamadda hubinta dukaanka ee maamulka Suuqify.",
        },
    ];

    return (
        <section id="features" className="py-20 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Maxaa Suuqify Ku Doortaa?
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
                        Wax kasta oo aad u baahan tahay si aad online wax ugu iibiso
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-3">
                        Waxaan meesha ka saarnay dhibaatadii website-yada waaweyn ee qaalliga ahaa.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={i}
                                className="bg-card border border-border/80 rounded-3xl p-6 shadow-2xs hover:border-primary/40 transition-all space-y-3"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Icon className="w-6 h-6 stroke-2" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}