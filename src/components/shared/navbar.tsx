"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, ArrowRight, LayoutDashboard } from "lucide-react";
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

    const logoImageSrc: string | null = null;
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
        { label: "Features", href: "/#features" },
        { label: "How it Works", href: "/#how-it-works" },
        { label: "Pricing", href: "/#pricing" },
        { label: "VIP Stores", href: "/#featured-stores" },
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
    ];

    // Hadii qofku login yahay goobta uu aadayo
    const destinationHref = userRole === "admin" ? "/admin" : "/store";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
                    {logoImageSrc ? (
                        <Image
                            src={logoImageSrc}
                            alt="Suuqify"
                            width={36}
                            height={36}
                            className="h-9 w-9 object-contain"
                            priority
                        />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                    )}
                    <span className="text-xl font-bold tracking-tight text-foreground">
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
                                className={buttonVariants({ className: "gap-1.5 shadow-sm px-5 rounded-xl font-semibold" })}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <Link
                                href="/signin"
                                className={buttonVariants({ className: "gap-1.5 shadow-sm px-5 rounded-xl font-semibold" })}
                            >
                                <span>Bilow Hadda</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        )
                    )}
                </div>

                {/* Mobile Responsive Menu */}
                <div className="flex items-center sm:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger
                            aria-label="Toggle Menu"
                            className={buttonVariants({ variant: "outline", size: "icon" })}
                        >
                            <Menu className="h-5 w-5" />
                        </SheetTrigger>

                        <SheetContent side="right" className="w-72">
                            <SheetHeader className="text-left">
                                <SheetTitle className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <ShoppingBag className="h-4 w-4" />
                                    </div>
                                    <span className="font-bold">
                                        Suuq<span className="text-primary">ify</span>
                                    </span>
                                </SheetTitle>
                            </SheetHeader>

                            <nav className="mt-8 flex flex-col space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-8 border-t border-border pt-6">
                                {!isLoading && (
                                    user ? (
                                        <Link
                                            href={destinationHref}
                                            onClick={() => setOpen(false)}
                                            className={buttonVariants({ className: "w-full justify-center gap-1.5 rounded-xl" })}
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/signin"
                                            onClick={() => setOpen(false)}
                                            className={buttonVariants({ className: "w-full justify-center gap-1.5 rounded-xl" })}
                                        >
                                            <span>Bilow Hadda</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}