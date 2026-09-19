"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, CheckCircle2, Clock } from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { toast } from "sonner";

interface StoreHeaderProps {
    storeName: string;
    status: string;
}

export function StoreHeader({ storeName, status }: StoreHeaderProps) {
    const handleLogout = async () => {
        toast.loading("Signing out...");
        await signOutAction();
    };

    const isActive = status === "active";

    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur px-4 md:px-6">
            <div className="flex items-center gap-2">
                {/* shadcn official Sidebar trigger for mobile sheet & desktop collapse */}
                <SidebarTrigger className="-ml-1 text-muted-foreground" />
                <Separator orientation="vertical" className="mr-2 h-4" />

                <div className="flex items-center gap-2">
                    <span className="text-sm md:text-base font-bold text-foreground truncate max-w-45 md:max-w-[320px]">
                        {storeName}
                    </span>

                    {isActive ? (
                        <Badge variant="outline" className="gap-1 border-emerald-300 bg-emerald-50 text-emerald-700 text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Active
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="gap-1 border-amber-300 bg-amber-50 text-amber-700 text-[11px]">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending
                        </Badge>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-medium">Log out</span>
                </Button>
            </div>
        </header>
    );
}