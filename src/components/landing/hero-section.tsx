import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    Sparkles,
    MessageCircle,
    ShieldCheck,
    Zap,
    TrendingUp,
    CheckCircle2,
    ShoppingBag,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-background pt-12 pb-20 md:pt-20 md:pb-28">
            {/* Background Subtle Gradient */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-112.5 w-162.5 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">

                    {/* Left Side: Copywriting & Actions */}
                    <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">

                        {/* Top Badge */}
                        <Badge variant="secondary" className="gap-2 px-3.5 py-1 text-xs font-semibold text-primary">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>The #1 in Somalia Platform to Take Your Business Online</span>
                        </Badge>

                        {/* Main Headline */}
                        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            U Fududee Macaamiishaada inay Hal Meel ka Arkaan{" "}
                            <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
                                Wax Walba oo Aad u Hayso
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
                            Ku dhis <strong>website-ka ganacsigaaga</strong> wax ka yar <strong>5 daqiiqo</strong> 
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <Link
                                href="/signin"
                                className={buttonVariants({ size: "lg", className: "h-12 px-7 text-base shadow-md gap-2 rounded-2xl font-bold" })}
                            >
                                <span>Bilow Ganacsigaaga Bilaash</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href="#featured-stores"
                                className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 px-6 text-base rounded-2xl font-semibold" })}
                            >
                                <span>Daawo Tusaale Ganacsi</span>
                            </Link>
                        </div>

                        {/* Trust Badges - Ku toosan shaashad kasta oo mobile ah */}
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 border-t border-border/70 pt-6 w-full text-left">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span className="text-xs font-medium text-muted-foreground leading-snug">
                                    Hal gujis WhatsApp Dalab
                                </span>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span className="text-xs font-medium text-muted-foreground leading-snug">
                                    EVC Plus, Zaad, Sahal & eDahab
                                </span>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span className="text-xs font-medium text-muted-foreground leading-snug">
                                    Ganacsiyo La Xaqiijiyay
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Storefront Mockup (Muunad Dukaanka ah) */}
                    <div className="relative mx-auto w-full max-w-md lg:col-span-5">
                        <Card className="border-border/80 shadow-2xl rounded-3xl overflow-hidden bg-card">
                            <CardContent className="p-4 sm:p-5 space-y-3.5">

                                {/* Top Mockup Indicator Header */}
                                <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            Muuqaal Ganacsi (Muunad)
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                                        suuqify.Online/hodan
                                    </span>
                                </div>

                                {/* Store Header Preview */}
                                <div className="rounded-2xl border border-border/60 bg-muted/30 p-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-base font-bold text-primary border border-primary/20 shrink-0">
                                            HF
                                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                <ShieldCheck className="h-3 w-3" />
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="font-bold text-foreground text-sm truncate">Hodan Fashion Store</h3>
                                                <Badge variant="outline" className="text-[9px] font-bold text-emerald-600 border-emerald-500/30 bg-emerald-500/10 py-0 px-1.5">
                                                    VIP
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground">suuqify.online/hodan</p>
                                            <p className="text-[11px] text-foreground/80 font-medium mt-0.5 truncate">
                                                Dharka casriga ah ee gabdhaha ✨
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Single Product Mock Card */}
                                <div className="rounded-2xl border border-border/70 bg-card p-3 shadow-xs space-y-3">
                                    <div className="flex gap-3">
                                        <div className="h-18 w-18 shrink-0 rounded-xl bg-muted border border-border/50 flex flex-col items-center justify-center text-muted-foreground/60 gap-1">
                                            <ShoppingBag className="h-5 w-5" />
                                            <span className="text-[9px] font-medium">Sawirka</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Badge variant="secondary" className="text-[9px] font-semibold text-emerald-700 bg-emerald-100 py-0 px-1.5">
                                                In Stock
                                            </Badge>
                                            <h4 className="mt-1 text-xs font-bold text-foreground truncate">
                                                Dirac Shaash & Jalbaab Modern 
                                            </h4>
                                            <p className="text-sm font-black text-emerald-600 mt-0.5">$25.00</p>
                                            <div className="mt-1 flex gap-1">
                                                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted border border-border/60 text-muted-foreground">
                                                    Madow
                                                </span>
                                                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted border border-border/60 text-muted-foreground">
                                                    Size: M
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simulated WhatsApp Order Bar (Interface Only) */}
                                    <div className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs select-none shadow-xs cursor-default">
                                        <MessageCircle className="h-4 w-4 fill-white shrink-0" />
                                        <span>Ku Dalbo WhatsApp (Hal Gujis)</span>
                                    </div>

                            
                                </div>

                            </CardContent>
                        </Card>

                        {/* Floating Stats Card */}
                        <Card className="absolute -bottom-4 -left-4 hidden sm:block border-border/80 shadow-lg rounded-2xl bg-card">
                            <CardContent className="flex items-center gap-3 p-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground">+140 Dalab</p>
                                    <p className="text-[10px] text-muted-foreground">Toddobaadkan</p>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                </div>
            </div>
        </section>
    );
}