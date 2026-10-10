"use client";

import React, { useState, useEffect, useTransition } from "react";
import { PlanItem } from "@/actions/admin/plans";
import { createPlanAction, updatePlanAction } from "@/actions/admin/plans";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PlanDialogProps {
    plan: PlanItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function PlanDialog({ plan, isOpen, onClose }: PlanDialogProps) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        name: "",
        price: 5,
        duration: 30,
        max_product: 15,
        is_feature: false,
    });

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                price: plan.price,
                duration: plan.duration,
                max_product: plan.max_product,
                is_feature: plan.is_feature,
            });
        } else {
            setFormData({
                name: "",
                price: 5,
                duration: 30,
                max_product: 15,
                is_feature: false,
            });
        }
    }, [plan, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Fadlan magaca qorshaha geli.");
            return;
        }

        startTransition(async () => {
            const res = plan
                ? await updatePlanAction(plan.id, formData)
                : await createPlanAction(formData);

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
            <DialogContent className="max-w-md rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">
                        {plan ? "Wax Ka Beddel Qorshaha" : "Ku Dar Qorshe Cusub"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Plan Name */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Magaca Xirmada (Plan Name)</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Starter, Growth, ama Pro VIP"
                            className="rounded-xl h-10 text-sm"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Price */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Qiimaha ($ USD)</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.5"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({ ...formData, price: Number(e.target.value) })
                                }
                                className="rounded-xl h-10 text-sm"
                                required
                            />
                        </div>

                        {/* Duration */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Muddada (Maalmo)</Label>
                            <Input
                                type="number"
                                min="1"
                                value={formData.duration}
                                onChange={(e) =>
                                    setFormData({ ...formData, duration: Number(e.target.value) })
                                }
                                className="rounded-xl h-10 text-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Max Products */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Xadka Boosaska (Max Products)</Label>
                        <Input
                            type="number"
                            min="1"
                            value={formData.max_product}
                            onChange={(e) =>
                                setFormData({ ...formData, max_product: Number(e.target.value) })
                            }
                            className="rounded-xl h-10 text-sm"
                            required
                        />
                        <p className="text-[11px] text-muted-foreground">
                            Tirada ugu badan ee Boos ah uu Ganacsigan xirmadan haysta uu gelin karo.
                        </p>
                    </div>

                    {/* VIP / Featured Switch */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/30">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-semibold cursor-pointer">
                                VIP Featured Store
                            </Label>
                            <p className="text-[11px] text-muted-foreground">
                                In Ganacsiga bogga hore ee Suuqify kaga soo baxo qaybta sare
                            </p>
                        </div>
                        <Switch
                            checked={formData.is_feature}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, is_feature: checked })
                            }
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl h-10 text-xs"
                        >
                            Ka Noqo
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl h-10 text-xs bg-primary text-primary-foreground font-semibold"
                        >
                            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                            {plan ? "Cusboonaysii" : "Abuur Qorshaha"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}