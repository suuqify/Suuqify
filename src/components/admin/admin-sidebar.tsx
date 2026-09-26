// src/components/admin/admin-sidebar.tsx
"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CreditCard,
    Receipt,
    Store,
    Layers,
    MapPin,
    LogOut,
    X,
} from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Payments Requests", href: "/admin/payments", icon: CreditCard },
    { label: "Billing & Revenue", href: "/admin/billing", icon: Receipt },
    { label: "Stores", href: "/admin/stores", icon: Store },
    { label: "Plans", href: "/admin/plans", icon: Layers },
    { label: "Categories & Cities", href: "/admin/categories-cities", icon: MapPin },
];

interface AdminSidebarProps {
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleSignOut = () => {
        startTransition(async () => {
            await signOutAction();
        });
    };

    const navContent = (
        <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border select-none">
            {/* Brand Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-sidebar-border">
                <Link href="/admin" className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm">
                        S
                    </div>
                    <div>
                        <span className="font-extrabold text-base tracking-tight text-sidebar-foreground">
                            Suuqify
                        </span>
                        <span className="text-[10px] block font-semibold text-primary uppercase tracking-widest -mt-1">
                            Admin Portal
                        </span>
                    </div>
                </Link>
                <button
                    onClick={onCloseMobile}
                    className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-sidebar-accent"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onCloseMobile}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                }`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Footer / Sign Out */}
            <div className="p-3 border-t border-sidebar-border">
                <Button
                    variant="ghost"
                    disabled={isPending}
                    onClick={handleSignOut}
                    className="w-full justify-start gap-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">Sign Out</span>
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0">
                {navContent}
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                        onClick={onCloseMobile}
                    />
                    <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar z-50 shadow-2xl transition-transform">
                        {navContent}
                    </div>
                </div>
            )}
        </>
    );
}