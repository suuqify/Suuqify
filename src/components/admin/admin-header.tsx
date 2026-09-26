"use client";

import React from "react";
import { ShieldAlert, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
    adminName: string;
    onOpenMobileNav: () => void;
}

export function AdminHeader({ adminName, onOpenMobileNav }: AdminHeaderProps) {
    return (
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenMobileNav}
                    className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                    <Menu className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-sm sm:text-base font-semibold text-foreground">
                        Maamulka Guud ee Suuqify
                    </h1>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                        Kusoo dhawaaw xarunta maamulka nidaamka
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-primary border border-primary/20">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Admin Portal</span>
                </div>
                <div className="hidden sm:block text-right">
                    <p className="text-xs font-medium text-foreground">{adminName}</p>
                    <p className="text-[10px] text-muted-foreground">Super Administrator</p>
                </div>
            </div>
        </header>
    );
}