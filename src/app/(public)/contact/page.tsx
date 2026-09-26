"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, MapPin, Send, Check } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        toast.success("Waad ku mahadsan tahay fariintaada! Si degdeg ah ayaan kula soo xiriiri doonnaa.");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 py-16 sm:py-20">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                            Nala Soo Xiriir
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Wax su&apos;aal ah ma qabtaa ama ma u baahan tahay caawimaad? Kooxdeennu waxay diyaar u tahay inay ku caawiso.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Details */}
                        <div className="space-y-4">
                            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-2xs space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block">WhatsApp Direct</span>
                                        <a
                                            href="https://wa.me/252610000000"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-bold text-foreground text-sm hover:underline"
                                        >
                                            +252 61 000 0000
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block">Email Taageerada</span>
                                        <span className="font-semibold text-foreground text-sm">support@suuqify.com</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block">Xarunta</span>
                                        <span className="font-semibold text-foreground text-sm">Muqdisho & Hargeysa</span>
                                    </div>
                                </div>
                            </div>

                            {/* Direct WhatsApp Callout */}
                            <div className="bg-emerald-600 text-white rounded-3xl p-6 shadow-sm space-y-3">
                                <h4 className="font-bold text-base">Ma doonaysaa jawaab degdeg ah?</h4>
                                <p className="text-xs text-emerald-100">
                                    Kooxdayada WhatsApp-ku waxay diyaar u tahay inay isla markiiba kaaga jawaabto codsiyadaada.
                                </p>
                                <a
                                    href="https://wa.me/252610000000"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 bg-white text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors shadow-2xs"
                                >
                                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                                    <span>Nagala Hadal WhatsApp</span>
                                </a>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xs">
                                {submitted ? (
                                    <div className="text-center py-12 space-y-3">
                                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                                            <Check className="w-6 h-6 stroke-[3]" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">Fariintaadu way na soo gaartay!</h3>
                                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                            Waad ku mahadsan tahay nala soo xiriirkaaga. Qof kooxdeena ka mid ah ayaa kugu soo jawaabi doona muddo kooban gudaheed.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-foreground">Magacaaga</label>
                                                <Input placeholder="Geli magacaaga oo buuxa" className="rounded-xl h-10 text-sm" required />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-foreground">Taleefanka ama WhatsApp</label>
                                                <Input placeholder="e.g. 061XXXXXXX" className="rounded-xl h-10 text-sm" required />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-foreground">Email-kaaga (Ikhtiyaari)</label>
                                            <Input type="email" placeholder="tusaale@gmail.com" className="rounded-xl h-10 text-sm" />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-foreground">Fariintaada</label>
                                            <Textarea
                                                rows={4}
                                                placeholder="Sideen kuu caawin karnaa maanta?"
                                                className="rounded-xl text-sm"
                                                required
                                            />
                                        </div>

                                        <Button type="submit" className="w-full sm:w-auto px-8 rounded-xl h-11 text-xs font-bold gap-2">
                                            <Send className="w-3.5 h-3.5" />
                                            <span>Dir Fariinta</span>
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}