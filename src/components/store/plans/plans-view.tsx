// src/components/store/plans/plans-view.tsx
"use client";

import { useState } from "react";
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plan, ActiveSubscription } from "./types";
import { PaymentDialog } from "./payment-dialog";

interface PlansViewProps {
    plans: Plan[];
    activeSubscription: ActiveSubscription | null;
}

export function PlansView({ plans, activeSubscription }: PlansViewProps) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSelectPlan = (plan: Plan) => {
        setSelectedPlan(plan);
        setDialogOpen(true);
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 py-1 font-medium">
                    Qorshayaasha Dukaanka
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Dooro Qorshaha Ku Habboon Ganacsigaaga
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Ka kordhi iibkaaga adigoo helaya alaab badan, taageero gaar ah, iyo muuqaalka sare ee dukaamada VIP-da ah.
                </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
                {plans.map((plan) => {
                    const isCurrentPlan = activeSubscription?.plan_id === plan.id;
                    const isFeatured = plan.is_feature;

                    return (
                        <Card
                            key={plan.id}
                            className={`relative flex flex-col justify-between transition-all duration-200 hover:shadow-xl ${isFeatured
                                ? "border-primary shadow-md ring-2 ring-primary/20 bg-card"
                                : "border-border/80 hover:border-primary/40 bg-card"
                                }`}
                        >
                            {/* VIP / Featured Ribbon */}
                            {isFeatured && (
                                <div className="absolute top-1.5 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground shadow-sm flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Ugu Caansan & VIP
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="pt-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                                    {isCurrentPlan && (
                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                            Qorshahaaga Hadda
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription className="text-xs text-muted-foreground mt-1">
                                    Muddada xirmadan waa {plan.duration} maalmood.
                                </CardDescription>

                                {/* Price Display */}
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-black tracking-tight text-foreground">
                                        ${plan.price}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        / {plan.duration === 30 ? "bishii" : `${plan.duration} maalmood`}
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 flex-1">
                                <div className="h-px bg-border/60 w-full" />
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-2.5 text-foreground">
                                        <div className="rounded-full bg-primary/10 p-1 text-primary">
                                            <Check className="h-3.5 w-3.5 stroke-3" />
                                        </div>
                                        <span>
                                            Ilaa <strong>{plan.max_product}</strong> Alaab oo aad soo gelin karto
                                        </span>
                                    </li>

                                    <li className="flex items-center gap-2.5 text-foreground">
                                        <div className="rounded-full bg-primary/10 p-1 text-primary">
                                            <Check className="h-3.5 w-3.5 stroke-3" />
                                        </div>
                                        <span>Dalabaadka tooska ah ee WhatsApp</span>
                                    </li>

                                    <li className="flex items-center gap-2.5 text-foreground">
                                        <div className="rounded-full bg-primary/10 p-1 text-primary">
                                            <Check className="h-3.5 w-3.5 stroke-3" />
                                        </div>
                                        <span>Link-in-bio shakhsi ah & QR Code</span>
                                    </li>

                                    {isFeatured ? (
                                        <li className="flex items-center gap-2.5 text-primary font-medium">
                                            <div className="rounded-full bg-primary/20 p-1 text-primary">
                                                <Sparkles className="h-3.5 w-3.5 stroke-3" />
                                            </div>
                                            <span>Ka dhex muuqo dukaamada VIP ee bogga hore</span>
                                        </li>
                                    ) : (
                                        <li className="flex items-center gap-2.5 text-muted-foreground">
                                            <div className="rounded-full bg-muted p-1 text-muted-foreground">
                                                <Check className="h-3.5 w-3.5 opacity-50" />
                                            </div>
                                            <span>Muujinta bogga hore kuma jirto</span>
                                        </li>
                                    )}

                                    <li className="flex items-center gap-2.5 text-foreground">
                                        <div className="rounded-full bg-primary/10 p-1 text-primary">
                                            <ShieldCheck className="h-3.5 w-3.5 stroke-3" />
                                        </div>
                                        <span>Dammaanad & Taageero 24/7</span>
                                    </li>
                                </ul>
                            </CardContent>

                            <CardFooter className="pt-2 pb-6">
                                <Button
                                    className={`w-full gap-2 transition-all ${isFeatured
                                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                                        }`}
                                    size="lg"
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={isCurrentPlan}
                                >
                                    {isCurrentPlan ? (
                                        "Waad Haysataa Qorshahan"
                                    ) : (
                                        <>
                                            <Zap className="h-4 w-4 fill-current" />
                                            Dooro Qorshahan
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Payment Modal */}
            <PaymentDialog
                plan={selectedPlan}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </div>
    );
}