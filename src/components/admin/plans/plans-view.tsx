"use client";

import React, { useState, useTransition } from "react";
import { PlanItem } from "@/actions/admin/plans";
import { deletePlanAction } from "@/actions/admin/plans";
import { PlanDialog } from "./plan-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Crown, Package, Clock, Check } from "lucide-react";

interface PlansViewProps {
    plans: PlanItem[];
}

export function PlansView({ plans }: PlansViewProps) {
    const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleCreate = () => {
        setSelectedPlan(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (plan: PlanItem) => {
        setSelectedPlan(plan);
        setIsDialogOpen(true);
    };

    const handleDelete = (plan: PlanItem) => {
        if (confirm(`Ma hubtaa inaad tirtirto qorshaha "${plan.name}"?`)) {
            startTransition(async () => {
                const res = await deletePlanAction(plan.id);
                if (res.success) toast.success(res.message);
                else toast.error(res.error);
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        Xirmooyinka (Subscription Plans)
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Maamul qiimaha, maalmaha, xadka Boosaska, iyo mudnaanta VIP-da ee Ganacsiyada.
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="rounded-xl text-xs font-semibold bg-primary text-primary-foreground gap-1.5 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Ku Dar Xirmo Cusub</span>
                </Button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative bg-card border rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${plan.is_feature
                                ? "border-primary/50 ring-1 ring-primary/20"
                                : "border-border/80"
                            }`}
                    >
                        {/* VIP Ribbon */}
                        {plan.is_feature && (
                            <div className="absolute -top-3 right-6">
                                <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                    <Crown className="w-3 h-3" /> VIP Featured
                                </span>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                            <div className="mt-3 flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-foreground tracking-tight">
                                    ${plan.price}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    / {plan.duration} maalmood
                                </span>
                            </div>

                            {/* Features List */}
                            <div className="mt-6 space-y-3 text-xs text-foreground/80 border-t border-border/60 pt-4">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-primary shrink-0" />
                                    <span>Xadka Boosaska: <strong className="text-foreground">{plan.max_product}</strong> alaab</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary shrink-0" />
                                    <span>Muddada Heshiiska: <strong className="text-foreground">{plan.duration}</strong> maalmood</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary shrink-0" />
                                    <span>WhatsApp Direct Checkout</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border/60">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(plan)}
                                className="flex-1 rounded-xl text-xs gap-1.5"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Wax Ka Beddel</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={isPending}
                                onClick={() => handleDelete(plan)}
                                className="h-9 w-9 p-0 text-muted-foreground hover:text-rose-600 rounded-xl"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <PlanDialog
                plan={selectedPlan}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </div>
    );
}