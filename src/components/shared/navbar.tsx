"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
    Menu, 
    ArrowRight, 
    LayoutDashboard,
    Sparkles,
    HelpCircle,
    CreditCard,
    Crown,
    Info,
    PhoneCall,
    ChevronRight
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/client";

export function Navbar() {
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState<any>(null);
    const [userRole, setUserRole] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const supabase = React.useMemo(() => createClient(), []);

    React.useEffect(() => {
        async function fetchUser() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUser(user);
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("role")
                        .eq("id", user.id)
                        .single();

                    if (profile) {
                        setUserRole(profile.role);
                    }
                }
            } catch (error) {
                console.error("Error fetching user session:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, [supabase]);

    const navLinks = [
        { label: "Features", href: "/#features", icon: Sparkles },
        { label: "How it Works", href: "/#how-it-works", icon: HelpCircle },
        { label: "Pricing", href: "/#pricing", icon: CreditCard },
        { label: "VIP Stores", href: "/#featured-stores", icon: Crown },
        { label: "About Us", href: "/about", icon: Info },
        { label: "Contact", href: "/contact", icon: PhoneCall },
    ];

    const destinationHref = userRole === "admin" ? "/admin" : "/store";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand Logo - Spacing tightened */}
                <Link href="/" className="flex items-center gap-1 transition-opacity hover:opacity-90">
                    <Image
                        src="/logo.png"
                        alt="Suuqify"
                        width={34}
                        height={34}
                        className="h-8.5 w-8.5 object-contain shrink-0"
                        priority
                    />
                  <span className="text-xl font-bold tracking-tight text-foreground leading-none translate-y-[4px]">
    Suuq<span className="text-primary">ify</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden items-center gap-7 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right CTA (Desktop) */}
                <div className="hidden items-center sm:flex">
                    {!isLoading && (
                        user ? (
                            <Link
                                href={destinationHref}
                                className={buttonVariants({ className: "gap-1.5 shadow-xs px-5 rounded-xl font-semibold" })}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <Link
                                href="/signin"
                                className={buttonVariants({ className: "gap-1.5 shadow-xs px-5 rounded-xl font-semibold" })}
                            >
                                <span>Bilow Hadda</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        )
                    )}
                </div>

                {/* Mobile Responsive Menu */}
                <div className="flex items-center md:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger
                            aria-label="Toggle Menu"
                            className={buttonVariants({ 
                                variant: "outline", 
                                size: "icon",
                                className: "h-10 w-10 rounded-xl border-border/80" 
                            })}
                        >
                            <Menu className="h-5 w-5" />
                        </SheetTrigger>

                        <SheetContent 
                            side="right" 
                            className="w-[88vw] max-w-sm p-0 flex flex-col justify-between border-l border-border/80 bg-background/95 backdrop-blur-xl"
                        >
                            {/* Drawer Header with Real Logo & tight spacing */}
                            <div>
                                <SheetHeader className="p-5 border-b border-border/60 text-left">
                                    <SheetTitle className="flex items-center gap-1">
                                        <Image
                                            src="/logo.png"
                                            alt="Suuqify"
                                            width={32}
                                            height={32}
                                            className="h-8 w-8 object-contain shrink-0"
                                            priority
                                        />
                                       <span className="text-xl font-bold tracking-tight text-foreground leading-none translate-y-[2px]">
    Suuq<span className="text-primary">ify</span>
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>

                                {/* Navigation Links List */}
                                <nav className="p-4 space-y-1.5">
                                    {navLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <Link
                                                key={link.label}
                                                href={link.href}
                                                onClick={() => setOpen(false)}
                                                className="group flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-muted/70 active:bg-muted transition-all select-none"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <span>{link.label}</span>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Drawer Footer CTA */}
                            <div className="p-5 border-t border-border/60 bg-muted/20 space-y-3">
                                {!isLoading && (
                                    user ? (
                                        <Link
                                            href={destinationHref}
                                            onClick={() => setOpen(false)}
                                            className={buttonVariants({ 
                                                className: "w-full justify-center gap-2 h-11 rounded-2xl font-semibold shadow-xs" 
                                            })}
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>Fur Dashboard-kaaga</span>
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/signin"
                                            onClick={() => setOpen(false)}
                                            className={buttonVariants({ 
                                                className: "w-full justify-center gap-2 h-11 rounded-2xl font-semibold bg-primary hover:bg-primary/95 text-primary-foreground shadow-xs" 
                                            })}
                                        >
                                            <span>Bilow Ganacsigaaga</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )
                                )}
                                <p className="text-[11px] text-center text-muted-foreground">
                                   Hoyga Ganacsiga Dijitaalka ah & Suuqa Jiilka Cusub 
                                </p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}