"use client";

import React, { useState } from "react";
import { ShieldAlert, Menu, Bell, BellRing, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveAdminSubscriptionAction, testPushNotificationAction } from "@/actions/admin/notifications";

export function AdminNotificationToggle() {
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [enabled, setEnabled] = useState(false);

    const enableNotifications = async () => {
        if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
            toast.error("Taleefankaagu ma taageerayo Push Notifications.");
            return;
        }

        setLoading(true);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                toast.error("Waa inaad ogolaataa ogeysiisyada (Allow Notifications).");
                setLoading(false);
                return;
            }

            const registration = await navigator.serviceWorker.register("/sw.js");
            await navigator.serviceWorker.ready;

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            });

            const res = await saveAdminSubscriptionAction(subscription.toJSON());
            if (res.success) {
                setEnabled(true);
                toast.success("Ogeysiisyada tooska ah waa la shiday!");
            } else {
                toast.error(res.error || "Khalad ayaa dhacay");
            }
        } catch (err: any) {
            toast.error("Khalad: " + (err?.message || "Lama oggolaan"));
        } finally {
            setLoading(false);
        }
    };

    const handleTestNotification = async () => {
        setTesting(true);
        try {
            const res = await testPushNotificationAction();
            if (res.success) {
                toast.success("Ogeysiiskii tijaabada ahaa waa la diray! Eeg shaashadda taleefankaaga.");
            } else {
                toast.error("Ma dirmin: " + (res.error || "Khalad"));
            }
        } catch (err: any) {
            toast.error("Khalad: " + (err?.message || "Lama oggolaan"));
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="flex items-center gap-1.5">
            <Button
                variant="outline"
                size="sm"
                onClick={enableNotifications}
                disabled={loading}
                className="rounded-xl text-xs gap-1.5 border-primary/30 text-primary h-9"
            >
                {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : enabled ? (
                    <BellRing className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                    <Bell className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                    {enabled ? "Ogeysiisyadu waa Shidanyihiin" : "Shid Ogeysiisyada"}
                </span>
            </Button>

            {/* Badhanka Tijaabada Tooska ah */}
            <Button
                variant="secondary"
                size="sm"
                onClick={handleTestNotification}
                disabled={testing}
                className="rounded-xl text-xs gap-1 h-9 px-2.5"
                title="Tijaabi Ogeysiiska Hadda"
            >
                {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                <span className="hidden md:inline">Tijaabi</span>
            </Button>
        </div>
    );
}

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

            <div className="flex items-center gap-2.5">
                <AdminNotificationToggle />

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