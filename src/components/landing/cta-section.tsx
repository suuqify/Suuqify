// src/components/landing/cta-section.tsx
import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="py-20 bg-background">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-8 sm:p-14 text-center shadow-lg">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ku Biir Boqolaal Ganacsato Soomaali ah</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Diyaar ma u tahay inaad ganacsigaaga kobciso?
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                            Ganacsigaaga online ka dhig Suuqify maanta! U soo bandhig macaamiishaada wax kasta oo kuu yaalla, si ay hal meel uga wada doortaan adiguna uga nasatid daalka fariimaha badan ee chat-ka.
                        </p>
                        <div className="pt-4">
                            <Link href="/signin">
                                <Button
                                    size="lg"
                                    className="h-12 px-8 rounded-2xl font-bold text-sm bg-white text-emerald-900 hover:bg-emerald-50 shadow-md gap-2"
                                >
                                    <span>Abuur Ganacsigaaga Hadda</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}