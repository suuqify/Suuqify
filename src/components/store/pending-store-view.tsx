"use client";

import { Clock, ShieldAlert, MessageCircle, RefreshCw, LogOut, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/actions/auth";

interface PendingStoreViewProps {
    storeName: string;
    status: string;
}

export function PendingStoreView({ storeName, status }: PendingStoreViewProps) {
    const isSuspended = status === "suspended";

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-muted/50 via-background to-muted/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-xl shadow-xl border-border/70 rounded-2xl sm:rounded-3xl overflow-hidden bg-card/95 backdrop-blur-sm">

                {/* Header Section */}
                <CardHeader className="text-center pt-8 pb-4 px-6 sm:px-8">
                    {/* Icon Status Indicator */}
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl transition-transform hover:scale-105 duration-300 shadow-inner">
                        {isSuspended ? (
                            <div className="h-full w-full rounded-3xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 flex items-center justify-center border border-rose-500/20">
                                <ShieldAlert className="h-10 w-10 animate-bounce" />
                            </div>
                        ) : (
                            <div className="h-full w-full rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 flex items-center justify-center border border-amber-500/20 relative">
                                <Clock className="h-10 w-10 animate-pulse" />
                                <span className="absolute top-2 right-2 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Store Title & Badge */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 mb-2">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground capitalize">
                            {storeName}
                        </h1>
                        <Badge
                            variant="secondary"
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${isSuspended
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
                                }`}
                        >
                            {isSuspended ? "La Hakiyay" : "Sugitaanka Ansixinta"}
                        </Badge>
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
    {isSuspended
        ? "Ganacsigaaga si ku-meel-gaar ah ayaa loo hakiyay. Fadlan la xiriir kooxda taageerada si dib loogu hawlgeliyo."
        : "Website-kaagu wuxuu ku jiraa hubinta iyo ansixinta maamulka. Wax yar ka dib ayaa si toos ah laguu hawlgelinayaa."}
</p>
                </CardHeader>

                {/* Content Section */}
                <CardContent className="space-y-4 px-5 sm:px-8 py-2">

                    {/* Status Step Card */}
                    <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 sm:p-5 space-y-3">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Maxaa hadda socda?
                        </h3>

                        <div className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>Waxaan hubinaynaa xogta ganacsigaaga si loo ilaaliyo kalsoonida iyo badqabka.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>Isla marka la ansixiyo, waxaad si toos ah u geli doontaa Dashboard-kaaga.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>Kadib waxaad si toos ah u bilaabi kartaa soo gelinta waxaad haysato.</span>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Fast Support Card */}
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left space-y-0.5">
                            <h4 className="text-sm font-semibold text-foreground">
    Ma doonaysaa ansixin degdeg ah?
</h4>
<p className="text-xs text-muted-foreground">
    Nagala soo xiriir WhatsApp si daqiiqado gudahood laguu hawlgeliyo
</p>
                        </div>

                        <a
                            href={`https://wa.me/252610000000?text=${encodeURIComponent(
                                `Asc Suuqify, waxaan rabaa in degdeg loo xaqiijiyo Ganacsigayga: ${storeName}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all duration-200 shrink-0"
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span>Kala hadal WhatsApp</span>
                        </a>
                    </div>
                </CardContent>

                {/* Footer Section */}
                <CardFooter className="flex flex-col sm:flex-row items-center gap-3 px-5 sm:px-8 pt-4 pb-8 border-t border-border/50">
                    {/* Refresh Button */}
                    <Button
                        variant="outline"
                        className="w-full sm:flex-1 h-11 rounded-xl gap-2 font-medium shadow-sm hover:bg-muted active:scale-[0.98] transition-all"
                        onClick={() => {
                            window.location.reload();
                        }}
                    >
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        Dib u cusboonaysii
                    </Button>

                    {/* Sign out form */}
                    <form
                        action={async () => {
                            await signOutAction();
                        }}
                        className="w-full sm:flex-1"
                    >
                        <Button
                            variant="ghost"
                            type="submit"
                            className="w-full h-11 rounded-xl gap-2 font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:scale-[0.98] transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            Ka bax (Sign Out)
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}