"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

interface AdminLayoutClientProps {
    adminName: string;
    children: React.ReactNode;
}

export function AdminLayoutClient({ adminName, children }: AdminLayoutClientProps) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <AdminSidebar
                mobileOpen={mobileNavOpen}
                onCloseMobile={() => setMobileNavOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader
                    adminName={adminName}
                    onOpenMobileNav={() => setMobileNavOpen(true)}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}