import React from "react";
import { UserCheck, UploadCloud, Share2 } from "lucide-react";

export function HowItWorksSection() {
    const steps = [
        {
            num: "01",
            icon: UserCheck,
            title: "Abuur Dukaankaaga",
            desc: "Ku gal akoonkaaga Google, dooro magaca dukaankaaga iyo lambarkaaga WhatsApp-ka ee dalabka.",
        },
        {
            num: "02",
            icon: UploadCloud,
            title: "Geli Alaabtaada",
            desc: "Soo geli sawirka alaabta, qiimaha, midabbada, iyo cabbirrada adigoo isticmaalaya dashboard-kaaga.",
        },
        {
            num: "03",
            icon: Share2,
            title: "Ku Dhaji Bio-gaaga & Hel Dalabyo",
            desc: "Link-gaaga gaarka ah (suuqify.com/dukaankaaga) ku dar TikTok/Instagram, macmiilkuna WhatsApp buu kugu soo dalbanayaa!",
        },
    ];

    return (
        <section id="how-it-works" className="py-20 bg-muted/20 border-t border-border/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Tallaabooyinka Fudud
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
                        Sida ay u Shaqeyso Suuqify
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Kaliya 3 tallaabo oo fudud ayaa kugu xiraya dukaankaaga riyada.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((s, idx) => {
                        const Icon = s.icon;
                        return (
                            <div key={idx} className="relative bg-card border border-border/80 rounded-3xl p-8 shadow-2xs">
                                <span className="text-4xl font-black text-muted-foreground/20 absolute top-6 right-6">
                                    {s.num}
                                </span>
                                <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-sm">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    {s.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}