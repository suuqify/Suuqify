"use client";

import Link from "next/link";
import {
    ShieldCheck,
    AlertTriangle,
    Sparkles,
    Package,
    Calendar,
    Clock,
    ArrowUpRight,
    CheckCircle2,
    History,
    Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SubscriptionViewData } from "./types";
import { cn } from "@/lib/utils";

interface SubscriptionViewProps {
    data: SubscriptionViewData;
}

// Helper function beddelaya format-ka 'date-fns'
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

// Helper function xisaabinaya farqiga maalmaha (differenceInDays)
function getDaysDifference(targetDate: Date, fromDate: Date): number {
    const diffTime = targetDate.getTime() - fromDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function SubscriptionView({ data }: SubscriptionViewProps) {
    const { currentSub, productCount, pastSubscriptions } = data;

    const now = new Date();
    const endDate = currentSub ? new Date(currentSub.end_date) : null;
    const daysLeft = endDate ? Math.max(0, getDaysDifference(endDate, now)) : 0;
    const isExpired = currentSub ? endDate! < now || currentSub.status === "expired" : true;

    // Xisaabi xadka alaabta (Usage percentage)
    const maxProducts = currentSub?.plan.max_product || 15;
    const usagePercentage = Math.min(100, Math.round((productCount / maxProducts) * 100));
    const isLimitReached = productCount >= maxProducts;

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Heshiiska Dukaanka (Subscription)
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Maamul qorshahaaga, hubi xadka alaabta kuu bannaan, iyo maalmaha kuu dhiman.
                    </p>
                </div>
                <Link
                    href="/store/plans"
                    className={cn(
                        buttonVariants(),
                        "bg-primary hover:bg-primary/90 text-primary-foreground gap-2 self-start sm:self-auto"
                    )}
                >
                    <Zap className="h-4 w-4 fill-current" />
                    {isExpired ? "Dib u Hawlgeli Qorshe" : "Kordhi Qorshaha (Upgrade)"}
                </Link>
            </div>

            {/* Haddii uusan jirin wax Subscription ah haba yaraatee */}
            {!currentSub ? (
                <Card className="border-dashed border-2 p-8 text-center space-y-4 max-w-xl mx-auto">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                        <AlertTriangle className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-foreground">Ma haysatid Qorshe Firfircoon</h3>
                        <p className="text-sm text-muted-foreground">
                            Dukaankaagu ma laha heshiis socda hadda. Dooro qorshe si aad u hesho awood buuxda.
                        </p>
                    </div>
                    <Link
                        href="/store/plans"
                        className={cn(buttonVariants(), "bg-primary hover:bg-primary/90 text-primary-foreground")}
                    >
                        Dooro Qorshe Hadda
                    </Link>
                </Card>
            ) : (
                <>
                    {/* Main Status & Plan Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Kaarka Weyn ee Qorshaha Hadda */}
                        <Card className="lg:col-span-2 border-border/80 shadow-sm relative overflow-hidden">
                            <div
                                className={`h-2 w-full absolute top-0 left-0 ${isExpired ? "bg-destructive" : "bg-primary"
                                    }`}
                            />
                            <CardHeader className="pt-6">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Qorshahaaga Rasmiga ah
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="text-2xl font-black text-foreground">
                                                {currentSub.plan.name}
                                            </CardTitle>
                                            {isExpired ? (
                                                <Badge variant="outline" className="text-destructive border-destructive/40 bg-destructive/5 font-semibold">
                                                    Wuu Dhacay (Expired)
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-semibold">
                                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                                                    Firfircoon (Active)
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-3xl font-extrabold text-foreground">
                                            ${currentSub.plan.price}
                                        </span>
                                        <span className="text-xs text-muted-foreground block">
                                            / {currentSub.plan.duration} maalmood
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 pt-2">
                                {/* Product Usage Progress Bar */}
                                <div className="space-y-2.5 rounded-xl border bg-muted/20 p-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-foreground flex items-center gap-2">
                                            <Package className="h-4 w-4 text-primary" />
                                            Xadka Alaabta aad Soo Galisay:
                                        </span>
                                        <span className="font-bold text-foreground">
                                            {productCount} / {maxProducts}{" "}
                                            <span className="text-xs font-normal text-muted-foreground">alaab</span>
                                        </span>
                                    </div>
                                    <Progress
                                        value={usagePercentage}
                                        className={`h-2.5 ${isLimitReached ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`}
                                    />
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{usagePercentage}% la isticmaalay</span>
                                        {isLimitReached ? (
                                            <span className="text-destructive font-medium">Xadkii waa buuxsamay!</span>
                                        ) : (
                                            <span>{maxProducts - productCount} alaab ayaa kuu bannaan</span>
                                        )}
                                    </div>
                                </div>

                                {/* Features Highlights */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    <div className="flex items-center gap-2.5 text-xs text-foreground p-2.5 rounded-lg border bg-card">
                                        <div className="p-1 rounded-full bg-primary/10 text-primary">
                                            <Sparkles className="h-3.5 w-3.5" />
                                        </div>
                                        <span>
                                            VIP Muuqaalka Bogga Hore:{" "}
                                            <strong>{currentSub.plan.is_feature ? "Haa (Shidan)" : "Kuma jiro"}</strong>
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2.5 text-xs text-foreground p-2.5 rounded-lg border bg-card">
                                        <div className="p-1 rounded-full bg-primary/10 text-primary">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                        </div>
                                        <span>Dalabka tooska ah ee WhatsApp: <strong>Shidan</strong></span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="bg-muted/10 border-t py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Bilaawday: {formatDate(currentSub.start_date)}
                                </span>
                                <span className="flex items-center gap-1.5 font-medium text-foreground">
                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                    Dhacaya: {formatDate(currentSub.end_date)}
                                </span>
                            </CardFooter>
                        </Card>

                        {/* Kaarka Maalmaha u Haray (Days Left Countdown Card) */}
                        <Card className="border-border/80 shadow-sm flex flex-col justify-between">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold text-foreground">
                                    Muddada Heshiiska
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Waqtiga xirmadaada u haray
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                                <div
                                    className={`flex h-24 w-24 items-center justify-center rounded-full border-4 ${isExpired
                                            ? "border-destructive/30 bg-destructive/5 text-destructive"
                                            : "border-primary/30 bg-primary/5 text-primary"
                                        }`}
                                >
                                    <div className="text-center">
                                        <span className="text-3xl font-black block leading-none">
                                            {isExpired ? "0" : daysLeft}
                                        </span>
                                        <span className="text-[11px] uppercase tracking-wider font-semibold">
                                            Maalmood
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground pt-2">
                                    {isExpired
                                        ? "Qorshahaagii wuu dhacay. Alaabtaada lama arki doono haddii aadan cusboonaysiin."
                                        : `${daysLeft} maalmood ka dib ayuu heshiiskaagu dhacayaa.`}
                                </p>
                            </CardContent>

                            <CardFooter className="pt-0">
                                <Link
                                    href="/store/plans"
                                    className={cn(
                                        buttonVariants(),
                                        "w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1.5"
                                    )}
                                >
                                    <ArrowUpRight className="h-4 w-4" />
                                    {isExpired ? "Dib u Fur Qorshaha" : "Cusboonaysii Hadda"}
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Qaybta Heshiisyadii Hore (Past Subscriptions History) */}
                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="border-b bg-muted/20 px-4 py-3 sm:px-6">
                            <div className="flex items-center gap-2">
                                <History className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base font-semibold">
                                    Taariikhda Heshiisyadii Hore
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {pastSubscriptions.length === 0 ? (
                                <div className="py-8 text-center text-xs text-muted-foreground">
                                    Ma jiraan heshiisyo hore oo dhacay.
                                </div>
                            ) : (
                                <div className="divide-y text-xs">
                                    {pastSubscriptions.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-bold text-foreground text-sm">
                                                    {sub.plan?.name || "Qorshe"}
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {formatDate(sub.start_date)} — {formatDate(sub.end_date)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-foreground">
                                                    ${sub.plan?.price}
                                                </span>
                                                <Badge variant="outline" className="text-muted-foreground text-[11px]">
                                                    Dhacay
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}