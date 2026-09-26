"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminStoreItem } from "@/actions/admin/stores";
import {
    approveAndVerifyStoreAction,
    toggleStoreVerifiedAction,
    updateStoreStatusAction,
} from "@/actions/admin/stores";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    BadgeCheck,
    ExternalLink,
    MapPin,
    Tag,
    User,
    Phone,
    Package,
    Calendar,
    ShieldCheck,
    PauseCircle,
    PlayCircle,
} from "lucide-react";

interface StoreDetailDialogProps {
    store: AdminStoreItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function StoreDetailDialog({ store, isOpen, onClose }: StoreDetailDialogProps) {
    const [isPending, startTransition] = useTransition();

    if (!store) return null;

    const handleApproveAndVerify = () => {
        startTransition(async () => {
            const res = await approveAndVerifyStoreAction(store.id);
            if (res.success) {
                toast.success(res.message);
                onClose();
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleToggleVerify = () => {
        startTransition(async () => {
            const res = await toggleStoreVerifiedAction(store.id);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleToggleStatus = (newStatus: "active" | "suspended") => {
        startTransition(async () => {
            const res = await updateStoreStatusAction(store.id, newStatus);
            if (res.success) {
                toast.success(res.message);
                onClose();
            } else {
                toast.error(res.error);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border-border/80">
                {/* Banner Section */}
                <div className="relative h-32 w-full bg-muted">
                    {store.backLogoUrl ? (
                        <Image
                            src={store.backLogoUrl}
                            alt={store.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-r from-primary/30 to-emerald-600/30" />
                    )}

                    {/* Logo overlay */}
                    <div className="absolute -bottom-8 left-6">
                        <div className="h-16 w-16 rounded-2xl border-4 border-background bg-card shadow-md overflow-hidden relative flex items-center justify-center">
                            {store.logoUrl ? (
                                <Image
                                    src={store.logoUrl}
                                    alt={store.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-xl font-bold text-primary">
                                    {store.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="pt-10 p-6 space-y-5">
                    {/* Header & Quick Link */}
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-foreground">{store.name}</h3>
                                {store.isVerified && (
                                    <BadgeCheck className="w-5 h-5 text-emerald-500 fill-emerald-100 shrink-0" />
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Created: {new Date(store.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <Link
                            href={`/${encodeURIComponent(store.name)}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                            <span>Visit Store</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Bio & About */}
                    {store.bio && (
                        <p className="text-xs text-foreground/90 bg-muted/30 p-3 rounded-xl border border-border/50 italic">
                            &quot;{store.bio}&quot;
                        </p>
                    )}

                    {/* Metrics & Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
                            <span className="text-[11px] text-muted-foreground  flex items-center gap-1">
                                <Tag className="w-3 h-3" /> Category
                            </span>
                            <span className="font-semibold text-xs text-foreground mt-1 block">
                                {store.categoryName}
                            </span>
                        </div>

                        <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
                            <span className="text-[11px] text-muted-foreground  flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> City / Location
                            </span>
                            <span className="font-semibold text-xs text-foreground mt-1 block truncate">
                                {store.cityName}
                            </span>
                        </div>

                        <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
                            <span className="text-[11px] text-muted-foreground  flex items-center gap-1">
                                <Package className="w-3 h-3" /> Total Products
                            </span>
                            <span className="font-semibold text-xs text-foreground mt-1 block">
                                {store.productsCount} Products
                            </span>
                        </div>
                    </div>

                    {/* Owner & Subscription Info */}
                    <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-muted-foreground font-medium block mb-1">
                                    Owner Details
                                </span>
                                <p className="font-semibold text-foreground flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                                    {store.owner.fullName}
                                </p>
                                <p className="font-mono text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                    Store WA: {store.whatsappNumber}
                                </p>
                            </div>

                            <div>
                                <span className="text-muted-foreground font-medium block mb-1">
                                    Active Subscription
                                </span>
                                {store.subscription ? (
                                    <div>
                                        <span className="font-semibold text-primary block">
                                            {store.subscription.planName}
                                        </span>
                                        <span className="text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Calendar className="w-3 h-3" />
                                            Expires: {new Date(store.subscription.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-amber-600 font-medium">No Active Plan</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                        {/* Toggle Verified */}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                            onClick={handleToggleVerify}
                            className="text-xs rounded-xl gap-1.5"
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{store.isVerified ? "Remove Verified" : "Make Verified"}</span>
                        </Button>

                        <div className="flex items-center gap-2">
                            {/* If pending: One click Approve & Verify */}
                            {store.status === "pending" && (
                                <Button
                                    size="sm"
                                    disabled={isPending}
                                    onClick={handleApproveAndVerify}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs rounded-xl font-semibold gap-1.5 shadow-xs"
                                >
                                    <BadgeCheck className="w-4 h-4" />
                                    <span>Approve & Verify</span>
                                </Button>
                            )}

                            {/* If active: Suspend button */}
                            {store.status === "active" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isPending}
                                    onClick={() => handleToggleStatus("suspended")}
                                    className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl gap-1.5"
                                >
                                    <PauseCircle className="w-3.5 h-3.5" />
                                    <span>Suspend Store</span>
                                </Button>
                            )}

                            {/* If suspended: Reactivate button */}
                            {store.status === "suspended" && (
                                <Button
                                    size="sm"
                                    disabled={isPending}
                                    onClick={() => handleToggleStatus("active")}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl gap-1.5"
                                >
                                    <PlayCircle className="w-3.5 h-3.5" />
                                    <span>Reactivate Store</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}