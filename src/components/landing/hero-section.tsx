import Link from "next/link";
import {
    ArrowRight,
    Sparkles,
    MessageCircle,
    ShieldCheck,
    Zap,
    TrendingUp,
    CheckCircle2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-background pt-12 pb-20 md:pt-20 md:pb-28">
            {/* Background Subtle Gradient (Tailwind v4 syntax) */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-112.5 w-162.5 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">

                    {/* Left Side: Copywriting & Actions */}
                    <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">

                        {/* shadcn Badge */}
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
    Ku dhis <strong>Website-kaaga ganacsi</strong> wax ka yar <strong>5 daqiiqo</strong>. 
    Macaamiishaadu waxay si toos ah u arkayaan dhammaan waxaad u hayso, qiimahooda, iyo faahfaahin kasta—iyagoo 
    toos <strong>WhatsApp</strong> kuugala soo xiriiraya iyagoo garanaya waxay rabaan, bilaa wareer.
</p>

                        {/* CTA Links styled with shadcn buttonVariants */}
                        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <Link
                                href="/signin"
                                className={buttonVariants({ size: "lg", className: "h-12 px-7 text-base shadow-md gap-2" })}
                            >
                                <span>Bilow Ganacsigaaga Bilaash</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href="#featured-stores"
                                className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 px-6 text-base" })}
                            >
                                <span>Daawo Tusaale Ganacsi</span>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">Hal gujis WhatsApp</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">EVC Plus, Zaad, Sahal & eDahab </span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">Ganacsiyo La Xaqiijiyay</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Storefront Mockup using shadcn Card */}
                    <div className="relative mx-auto w-full max-w-md lg:col-span-5">
                        <Card className="border-border/80 shadow-2xl">
                            <CardContent className="p-5">

                                {/* Store Header Preview */}
                                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex h-13 w-13 items-center justify-center rounded-full bg-primary/15 text-base font-bold text-primary border-2 border-primary">
                                            HF
                                            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                <ShieldCheck className="h-3.5 w-3.5" />
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h2 className="font-bold text-foreground">Hodan Fashion Store</h2>
                                                <Badge variant="outline" className="text-[10px] text-primary border-primary/40">VIP</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">suuqify.com/hodanfashion</p>
                                            <p className="mt-1 text-xs text-foreground/80 font-medium">
                                                Dharka casriga ah ee gabdhaha & carruurta ✨
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Single Product Card */}
                                <div className="mt-4 rounded-xl border border-border bg-card p-3.5 shadow-sm">
                                    <div className="flex gap-3">
                                        <div className="h-20 w-20 shrink-0 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
                                            Sawirka
                                        </div>
                                        <div className="flex-1">
                                            <Badge variant="secondary" className="text-[10px] text-primary py-0">
                                                In Stock
                                            </Badge>
                                            <h3 className="mt-1 text-sm font-semibold text-foreground">Dirac Shaash & Jalbaab Modern</h3>
                                            <p className="text-sm font-bold text-foreground mt-0.5">$25.00</p>
                                            <div className="mt-2 flex gap-1">
                                                <Badge variant="outline" className="text-[10px] font-normal">Madow</Badge>
                                                <Badge variant="outline" className="text-[10px] font-normal">Size: M</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* WhatsApp Action Button */}
                                    <Button className="mt-3.5 w-full bg-[#25D366] text-white hover:bg-[#25D366]/90 gap-2">
                                        <MessageCircle className="h-4 w-4 fill-white" />
                                        <span>Ku Dalbo WhatsApp</span>
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>

                        {/* Floating Stats Card */}
                        <Card className="absolute -bottom-5 -left-4 hidden sm:block border-border/80 shadow-lg">
                            <CardContent className="flex items-center gap-3 p-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground">+140 Dalab</p>
                                    <p className="text-[10px] text-muted-foreground">Toddobaadkii lasoo dhaafay</p>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                </div>
            </div>
        </section>
    );
}