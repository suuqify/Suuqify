import React from "react";
import Link from "next/link";
import { ShoppingBag, Heart, MessageCircle } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border/80 bg-muted/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                Suuq<span className="text-primary">ify</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                           Madal casri ah oo ganacsatada Soomaalida u suurtagelisa inay daqiiqado gudahood ku yeeshaan Website ganacsi, dalabyadana toos WhatsApp kaga helaan.
                        </p>
                        {/* Payment Methods Badges */}
                        <div className="pt-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                                Hababka Lacag-bixinta
                            </span>
                            <div className="flex flex-wrap gap-2 text-xs font-medium text-foreground">
                                <span className="bg-card px-2.5 py-1 rounded-lg border border-border shadow-2xs">EVC Plus</span>
                                <span className="bg-card px-2.5 py-1 rounded-lg border border-border shadow-2xs">Zaad Service</span>
                                <span className="bg-card px-2.5 py-1 rounded-lg border border-border shadow-2xs">Sahal</span>
                                <span className="bg-card px-2.5 py-1 rounded-lg border border-border shadow-2xs">eDahab</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Xiriirro Fudud</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/#features" className="hover:text-primary transition-colors">Astaamaha (Features)</Link></li>
                            <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">Sida ay u Shaqeyso</Link></li>
                            <li><Link href="/#pricing" className="hover:text-primary transition-colors">Qorshayaasha Qiimaha</Link></li>
                            <li><Link href="/#featured-stores" className="hover:text-primary transition-colors">Dukaamada VIP-da</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Company */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Shirkadda</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">Nagu Saabsan (About Us)</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Nala Soo Xiriir (Contact)</Link></li>
                            <li><Link href="/signin" className="hover:text-primary transition-colors">Soo Gal Akoonkaaga</Link></li>
                        </ul>
                    </div>
                </div>

               {/* Bottom Bar */}
<div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
    <p>© {new Date().getFullYear()} Suuqify Inc. Xuquuqda oo dhan waa dhowran tahay.</p>
    <p className="flex items-center gap-1">
        Lagu dhisay <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block" /> looguna talagalay ganacsatada Soomaaliyeed.
    </p>
</div>
            </div>
        </footer>
    );
}