import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FeaturedStoreItem } from "@/actions/public/home";
import { BadgeCheck, Crown, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface FeaturedStoresSectionProps {
    stores: FeaturedStoreItem[];
}

export function FeaturedStoresSection({ stores }: FeaturedStoresSectionProps) {
    const hasStores = stores && stores.length > 0;

    return (
        <section id="featured-stores" className="py-16 sm:py-20 bg-muted/30 border-y border-border/60 scroll-mt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20 mb-2">
                            <Crown className="w-3.5 h-3.5" />
                            <span>VIP Merchant Showcase</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                            Ganacsiyada VIP-da ee ugu Caansan
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                            Ganacsiyadaan waxay isticmaalaan Xirmada VIP-da ee Suuqify si ay u helaan kumanaan macaamiil ah maalin kasta.
                        </p>
                    </div>

                    {!hasStores && (
                        <Link
                            href="/#pricing"
                            className={buttonVariants({
                                className: "rounded-xl font-semibold gap-1.5 bg-amber-600 hover:bg-amber-700 text-white shadow-xs self-start sm:self-auto",
                            })}
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Noqo VIP Hadda</span>
                        </Link>
                    )}
                </div>

                {/* 1. Haddii ay jiraan Dukaamo VIP ah: Soo bandhig Grids-ka */}
                {hasStores ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.map((s) => (
                            <Link
                                key={s.id}
                                href={`/s/${encodeURIComponent(s.name)}`}
                                target="_blank"
                                className="bg-card border border-border/80 hover:border-primary/50 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col"
                            >
                                {/* Banner */}
                                <div className="h-28 w-full bg-muted relative">
                                    {s.backLogoUrl ? (
                                        <Image src={s.backLogoUrl} alt={s.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-emerald-600/30 to-teal-700/30" />
                                    )}
                                    {/* Logo */}
                                    <div className="absolute -bottom-5 left-5">
                                        <div className="h-12 w-12 rounded-xl border-2 border-background bg-card shadow-sm overflow-hidden relative flex items-center justify-center font-bold text-primary">
                                            {s.logoUrl ? (
                                                <Image src={s.logoUrl} alt={s.name} fill className="object-cover" />
                                            ) : (
                                                s.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="pt-8 p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 font-bold text-base text-foreground">
                                                <span>{s.name}</span>
                                                {s.isVerified && (
                                                    <BadgeCheck className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                                                )}
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-0.5 block">
                                            {s.cityName} • {s.categoryName}
                                        </span>
                                        {s.bio && (
                                            <p className="text-xs text-muted-foreground/80 mt-2.5 line-clamp-2">
                                                {s.bio}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                                        <span>Booqo Ganacsiga</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* 2. Haddii uusan jirin VIP: Soo bandhig Kaadh dhiirrigelin ah oo iibka kordhiya */
                    <div className="rounded-3xl border-2 border-dashed border-amber-500/30 bg-amber-500/5 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
                        <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                            <Crown className="h-7 w-7" />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-lg sm:text-xl font-bold text-foreground">
                                Noqo Ganacsigii Ugu Horreeyay ee VIP ah!
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                Boosaskan waxaa loogu talagalay ganacsiyada VIP-da ee doonaya inay toos uga soo muuqdaan bogga hore ee Suuqify si ay u labanlaabaan iibkooda.
                            </p>
                        </div>
                        <div className="pt-2">
                            <Link
                                href="/#pricing"
                                className={buttonVariants({
                                    className: "rounded-xl font-semibold gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-6",
                                })}
                            >
                                <span>iibso xirmada VIP</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}