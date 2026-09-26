"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Sparkles,
    ShieldCheck,
    ReceiptText,
    Store as StoreIcon,
    ExternalLink,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const STORE_NAV_LINKS = [
    {
        title: "Overview",
        href: "/store",
        icon: LayoutDashboard,
        exact: true,
    },
    {
        title: "Products",
        href: "/store/products",
        icon: Package,
    },
    {
        title: "Plans",
        href: "/store/plans",
        icon: Sparkles,
    },
    {
        title: "Subscription",
        href: "/store/subscription",
        icon: ShieldCheck,
    },
    {
        title: "Billing",
        href: "/store/billing",
        icon: ReceiptText,
    },
    {
        title: "Store Settings",
        href: "/store/settings",
        icon: StoreIcon,
    },
];

interface StoreSidebarProps {
    storeName: string;
}

export function StoreSidebar({ storeName }: StoreSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const isLinkActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    const storeUrl = `/${encodeURIComponent(storeName.toLowerCase().replace(/\s+/g, "-"))}`;

    return (
        <Sidebar collapsible="icon">
            {/* Header: Logo & Brand */}
            <SidebarHeader className="border-b border-sidebar-border h-16 justify-center">
                <Link href="/store" className="flex items-center gap-2.5 px-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-base shadow-sm">
                        S
                    </div>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="font-bold text-base leading-none text-sidebar-foreground">
                            Suuq<span className="text-primary">ify</span>
                        </span>
                        <span className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-35">
                            {storeName}
                        </span>
                    </div>
                </Link>
            </SidebarHeader>

            {/* Navigation Content */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                        Store Management
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {STORE_NAV_LINKS.map((item) => {
                                const active = isLinkActive(item.href, item.exact);
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            isActive={active}
                                            tooltip={item.title}
                                            onClick={() => router.push(item.href)}
                                            className={`cursor-pointer ${active
                                                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-semibold"
                                                : ""
                                                }`}
                                        >
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer: Live Storefront link */}
            <SidebarFooter className="border-t border-sidebar-border p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="View Store"
                            onClick={() => window.open(storeUrl, "_blank", "noopener,noreferrer")}
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold cursor-pointer"
                        >
                            <ExternalLink className="w-4 h-4 shrink-0 text-primary" />
                            <span className="truncate group-data-[collapsible=icon]:hidden">
                                View Store
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}