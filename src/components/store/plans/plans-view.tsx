"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Sparkles, Zap, ShieldCheck, Gift, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Plan, ActiveSubscription } from "./types";
import { PaymentDialog } from "./payment-dialog";
import { claimFreeTrialAction } from "@/actions/store/plans";

interface PlansViewProps {
    plans: Plan[];
    activeSubscription: ActiveSubscription | null;
}

export function PlansView({ plans, activeSubscription }: PlansViewProps) {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    
    // Modal-ka Hubinta ee Free Trial-ka
    const [confirmTrialOpen, setConfirmTrialOpen] = useState(false);
    const [trialPlanToClaim, setTrialPlanToClaim] = useState<Plan | null>(null);

    const [isPending, startTransition] = useTransition();

    const handleSelectPlan = (plan: Plan) => {
        // HADDII AY TAHAY FREE TRIAL ($0): Fur modal-ka hubinta
        if (Number(plan.price) === 0) {
            setTrialPlanToClaim(plan);
            setConfirmTrialOpen(true);
            return;
        }

        // HADDII AY TAHAY LACAG: Fur modal-ka lacag-bixinta
        setSelectedPlan(plan);
        setPaymentModalOpen(true);
    };

    // Marka qofku hubiyo ee uu taabto "Haa, Hawlgeli Hadda"
    const handleConfirmClaimTrial = () => {
        if (!trialPlanToClaim) return;

        startTransition(async () => {
            const res = await claimFreeTrialAction(trialPlanToClaim.id);
            if (res.success) {
                toast.success(res.message || "Tijaabada waa la hawlgeliyay!");
                setConfirmTrialOpen(false);
                router.push("/store");
                router.refresh();
            } else {
                toast.error(res.error || "Khalad ayaa dhacay.");
            }
        });
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 py-1 font-medium">
                    Xirmooyinka Ganacsiga
                </Badge>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Dooro Xirmada ku Habboon Ganacsigaaga
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm">
                    Ballaari suuqaaga adigoo helaya website heer sare ah oo toos looga Arko Adeegyadaada Dhan.
                </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
                {plans.map((plan) => {
                    const isCurrentPlan = activeSubscription?.plan_id === plan.id;
                    const isFeatured = plan.is_feature;
                    const isFree = Number(plan.price) === 0;

                    return (
                        <Card
                            key={plan.id}
                            className={`relative flex flex-col justify-between transition-all duration-200 hover:shadow-xl ${
                                isFeatured
                                    ? "border-primary shadow-md ring-2 ring-primary/20 bg-card"
                                    : isFree
                                    ? "border-emerald-500/50 bg-emerald-500/5 shadow-xs"
                                    : "border-border/80 bg-card"
                            }`}
                        >
                            {/* Ribbons */}
                            {isFeatured ? (
                                <div className="absolute top-2 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground shadow-sm flex items-center gap-1 px-3 py-0.5 text-[11px] font-semibold">
                                        <Sparkles className="h-3 w-3" />
                                        Heer Sare & VIP
                                    </Badge>
                                </div>
                            ) : isFree ? (
                                <div className="absolute top-2 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-emerald-600 text-white shadow-sm flex items-center gap-1 px-3 py-0.5 text-[11px] font-semibold">
                                        <Gift className="h-3 w-3" />
                                        Tijaabo Bilaash ah (Free)
                                    </Badge>
                                </div>
                            ) : null}

                            <CardHeader className="pt-7">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                                    {isCurrentPlan && (
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-[10px]">
                                            Xirmadaada Hadda
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription className="text-xs text-muted-foreground mt-1">
                                    {isFree ? `Tijaabi bilaash muddo ${plan.duration} maalmood ah` : `Xirmo soconaysa ${plan.duration} maalmood`}
                                </CardDescription>

                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                                        {isFree ? "$0" : `$${plan.price}`}
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        / {plan.duration} maalmood
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3.5 flex-1">
                                <div className="h-px bg-border/60 w-full" />
                                <ul className="space-y-2.5 text-xs sm:text-sm">
                                    <li className="flex items-center gap-2 text-foreground">
                                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                                        <span>Soo bandhig ilaa <strong>{plan.max_product} Boos</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2 text-foreground">
                                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                                        <span>Xiriirka tooska ah ee WhatsApp</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-foreground">
                                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                                        <span>Website-kaaga gaarka ah</span>
                                    </li>
                                    {isFeatured && (
                                        <li className="flex items-center gap-2 text-primary font-semibold">
                                            <Sparkles className="h-3.5 w-3.5 shrink-0" />
                                            <span>Ka muuqashada Bogga Hore (VIP)</span>
                                        </li>
                                    )}
                                </ul>
                            </CardContent>

                            <CardFooter className="pt-2 pb-6">
                                <Button
                                    className={`w-full gap-2 rounded-xl transition-all font-semibold ${
                                        isFree
                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                            : isFeatured
                                            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                                    }`}
                                    size="lg"
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={isCurrentPlan}
                                >
                                    {isCurrentPlan ? (
                                        "Waad Haysataa Xirmadan"
                                    ) : isFree ? (
                                        <>
                                            <Gift className="h-4 w-4" />
                                            Qaado Tijaabada Bilaashka ah
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="h-4 w-4 fill-current" />
                                            Dooro Xirmadan
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* 1. Modal-ka Hubinta ee Free Trial-ka (Confirmation Dialog) */}
            <Dialog open={confirmTrialOpen} onOpenChange={setConfirmTrialOpen}>
                <DialogContent className="max-w-md p-5 sm:p-6 rounded-3xl border shadow-2xl">
                    <DialogHeader className="space-y-2 text-left">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
                            <Gift className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
                            Xaqiijinta Tijaabada Bilaashka ah
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                            Ma hubtaa inaad rabto inaad hawlgeliso <strong>{trialPlanToClaim?.name}</strong> muddo <strong>{trialPlanToClaim?.duration} maalmood ah</strong>?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-muted/40 rounded-2xl p-3.5 border border-border/60 text-xs space-y-1.5 text-muted-foreground my-2">
                        <p className="flex items-center gap-1.5 text-foreground font-semibold">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            Qiimaha: $0 (Wax lacag ah ma bixinaysid)
                        </p>
                        <p className="flex items-center gap-1.5">
                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                            Xusuusnow: Fursaddan tijaabada ah hal mar oo kaliya ayaad heli kartaa.
                        </p>
                    </div>

                    <DialogFooter className="grid grid-cols-2 gap-2 sm:flex sm:justify-end pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmTrialOpen(false)}
                            disabled={isPending}
                            className="rounded-xl h-10 text-xs"
                        >
                            Ka noqo
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmClaimTrial}
                            disabled={isPending}
                            className="rounded-xl h-10 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Fadlan sug...</span>
                                </>
                            ) : (
                                <span>Haa, Hawlgeli Hadda</span>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 2. Modal-ka Lacag-Bixinta (Xirmooyinka Lacagta leh) */}
            <PaymentDialog
                plan={selectedPlan}
                open={paymentModalOpen}
                onOpenChange={setPaymentModalOpen}
            />
        </div>
    );
}