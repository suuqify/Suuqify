import React from "react";
import Link from "next/link";
import { PublicPlanItem } from "@/actions/public/home";
import { Check, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
    plans: PublicPlanItem[];
}

export function PricingSection({ plans }: PricingSectionProps) {
    return (
        <section id="pricing" className="py-20 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Qiimo Jaban & Hufan
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
                        Dooro Qorshaha Ganacsigaaga Ku Habboon
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Ku bixi EVC Plus, Zaad, Sahal, ama eDahab. Ma jiro wax lacag ah oo qarsoon.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
                    {plans.map((p) => (
                        <div
                            key={p.id}
                            className={`relative bg-card border rounded-3xl p-8 shadow-2xs flex flex-col justify-between transition-all ${p.isFeature
                                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                                    : "border-border/80"
                                }`}
                        >
                            {p.isFeature && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                        <Crown className="w-3.5 h-3.5" /> Ugu Caansan (VIP)
                                    </span>
                                </div>
                            )}

                            <div>
                                <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold text-foreground">${p.price}</span>
                                    <span className="text-xs text-muted-foreground">/ {p.duration} maalmood</span>
                                </div>

                                <ul className="mt-6 space-y-3 text-xs sm:text-sm text-foreground/80 border-t border-border/60 pt-6">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-primary shrink-0" />
                                        <span>Xadka Alaabta: <strong>{p.maxProduct}</strong> alaab</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-primary shrink-0" />
                                        <span>WhatsApp Instant Checkout</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-primary shrink-0" />
                                        <span>Link-in-Bio Micro-Storefront</span>
                                    </li>
                                    {p.isFeature && (
                                        <li className="flex items-center gap-2 text-primary font-semibold">
                                            <Crown className="w-4 h-4 shrink-0" />
                                            <span>Ka dhex muuqo Bogga Hore (VIP)</span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border/60">
                                <Link href="/signin">
                                    <Button
                                        className={`w-full rounded-2xl h-11 text-xs font-bold gap-1.5 ${p.isFeature
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                                : ""
                                            }`}
                                        variant={p.isFeature ? "default" : "outline"}
                                    >
                                        <span>Bilow Qorshahan</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}