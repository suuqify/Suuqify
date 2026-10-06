import React from "react";
import Link from "next/link";
import { PlusCircle, Sliders, Layers, Receipt } from "lucide-react";

export function QuickActions() {
    const actions = [
        {
            title: "+ Add New",
            desc: "Soo bandhig wax kasta oo cusub oo aad u haysid macaamiishaada",
            href: "/store/products",
            icon: PlusCircle,
            accent: "bg-primary/10 text-primary border-primary/20",
        },
        {
            title: "Habee Ganacsigaga (Settings)",
            desc: "Beddel sawirrada Logo-da, Banner-ka, ama Bio-ga",
            href: "/store/settings",
            icon: Sliders,
            accent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        },
        {
            title: "Kordhi Qorshaha (Upgrade)",
            desc: "Dooro qorshe kuu oggolaanaya isticmaal dheeraad ah.",
            href: "/store/plans",
            icon: Layers,
            accent: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        },
        {
            title: "Taariikhda Lacagaha",
            desc: "Eeg dhammaan heshiisyadii iyo lacagihii aad bixisay",
            href: "/store/billing",
            icon: Receipt,
            accent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        },
    ];

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Ficillada Degdegga ah (Quick Actions)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((act) => {
                    const Icon = act.icon;
                    return (
                        <Link
                            key={act.href}
                            href={act.href}
                            className="bg-card border border-border/80 rounded-2xl p-4 shadow-xs hover:border-primary/40 hover:shadow-sm transition-all group flex items-start gap-3.5"
                        >
                            <div
                                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${act.accent}`}
                            >
                                <Icon className="w-5 h-5 group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="space-y-0.5">
                                <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors block">
                                    {act.title}
                                </span>
                                <span className="text-xs text-muted-foreground line-clamp-1 block">
                                    {act.desc}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}