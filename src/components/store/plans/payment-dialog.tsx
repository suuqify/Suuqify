"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    CheckCircle2,
    Copy,
    Loader2,
    Smartphone,
    ShieldCheck,
    CreditCard,
    ArrowRight
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { submitPaymentAction } from "@/actions/store/plans";
import { Plan } from "./types";

interface PaymentDialogProps {
    plan: Plan | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PAYMENT_ACCOUNTS = [
    { name: "EVC Plus", number: "0612345678", desc: "Hormuud" },
    { name: "Zaad", number: "0631234567", desc: "Telesom" },
    { name: "Sahal", number: "0621234567", desc: "Golis" },
    { name: "eDahab", number: "0651234567", desc: "Somtel" },
];

export function PaymentDialog({ plan, open, onOpenChange }: PaymentDialogProps) {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<string>("EVC Plus");
    const [senderPhone, setSenderPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

    if (!plan) return null;

    const handleCopy = (number: string) => {
        navigator.clipboard.writeText(number);
        setCopiedNumber(number);
        toast.success("Lambarka waa la koobiyeeyay!");
        setTimeout(() => setCopiedNumber(null), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!senderPhone.trim()) {
            toast.error("Fadlan geli lambarka aad lacagta ka soo dirtay.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await submitPaymentAction({
                planId: plan.id,
                paymentMethod,
                senderPhone,
            });

            if (!res.success) {
                toast.error(res.error || "Khalad ayaa dhacay");
            } else {
                toast.success("Dalabkaaga lacag-bixinta si guul leh ayaa loo diray!");
                onOpenChange(false);
                setSenderPhone("");
                router.push("/store/billing");
            }
        } catch {
            toast.error("Khalad aan la filayn ayaa dhacay.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-480px p-5 sm:p-7 rounded-2xl max-h-[92vh] overflow-y-auto border shadow-xl">

                {/* Header & Plan Summary */}
                <DialogHeader className="space-y-3 pr-6">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                Xaqiijinta Dalabka
                            </span>
                            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                                {plan.name}
                            </DialogTitle>
                        </div>

                        {/* Price Badge - Si fiican oo qurux badan u muuqanaysa */}
                        <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-800/60 rounded-xl px-3.5 py-1.5 text-right flex items-center justify-center flex-col">
                            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block leading-none">
                                Wadarta
                            </span>
                            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                ${plan.price}
                            </span>
                        </div>
                    </div>

                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        U dir lacagta mid ka mid ah akoonnada hoose, kadibna foomka ku buuxi lambarka aad lacagta ka soo dirtay.
                    </DialogDescription>
                </DialogHeader>

                {/* Akoonnada Shirkadda (Responsive Grid 2x2 Laptop & Tablet, 1 col on small phones) */}
                <div className="space-y-2.5 my-1">
                    <div className="flex items-center justify-between">
                        <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-primary" />
                            Akoonnada Shirkadda:
                        </Label>
                        <span className="text-[10px] text-muted-foreground">Guji si aad u koobiyeysato</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {PAYMENT_ACCOUNTS.map((acc) => {
                            const isCopied = copiedNumber === acc.number;
                            return (
                                <div
                                    key={acc.name}
                                    onClick={() => handleCopy(acc.number)}
                                    className={`group relative flex flex-col justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${isCopied
                                            ? "border-emerald-500 bg-emerald-500/5 shadow-sm"
                                            : "border-border/60 bg-muted/30 hover:border-primary/40 hover:bg-muted/60"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-xs text-foreground flex items-center gap-1">
                                            {acc.name}
                                        </span>
                                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                                            {isCopied ? (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-mono font-medium text-xs tracking-tight text-foreground">
                                            {acc.number}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground/70 hidden sm:inline">
                                            {acc.desc}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Foomka Xaqiijinta */}
                <form onSubmit={handleSubmit} className="space-y-4 pt-3 border-t">

                    {/* Habka Lacag Bixinta (Dropdown la casriyeeyay) */}
                    <div className="space-y-1.5">
                        <Label htmlFor="method" className="text-xs font-medium text-foreground">
                            Habka Lacag-bixinta
                        </Label>
                        <Select
                            value={paymentMethod}
                            onValueChange={(value) => {
                                if (value) setPaymentMethod(value);
                            }}
                        >
                            <SelectTrigger
                                id="method"
                                className="h-11 w-full rounded-xl bg-background border-border/80 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                            >
                                <SelectValue placeholder="Dooro Habka" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-lg border">
                                <SelectItem value="EVC Plus" className="py-2.5 font-medium cursor-pointer">
                                    EVC Plus (Hormuud)
                                </SelectItem>
                                <SelectItem value="Zaad" className="py-2.5 font-medium cursor-pointer">
                                    Zaad Service (Telesom)
                                </SelectItem>
                                <SelectItem value="Sahal" className="py-2.5 font-medium cursor-pointer">
                                    Sahal Service (Golis)
                                </SelectItem>
                                <SelectItem value="eDahab" className="py-2.5 font-medium cursor-pointer">
                                    eDahab (Somtel)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Lambarka Qofka */}
                    <div className="space-y-1.5">
                        <Label htmlFor="sender_phone" className="text-xs font-medium text-foreground">
                            Lambarka aad Lacagta Ka Soo Dirtay
                        </Label>
                        <div className="relative">
                            <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="sender_phone"
                                type="tel"
                                placeholder="061XXXXXXX ama 063XXXXXXX"
                                value={senderPhone}
                                onChange={(e) => setSenderPhone(e.target.value)}
                                className="pl-11 h-11 rounded-xl bg-background border-border/80 font-mono text-sm tracking-wide focus-visible:ring-2 focus-visible:ring-primary/20"
                                required
                            />
                        </div>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            Hubi inuu lambarku sax yahay si dalabkaagu uusan dib ugu dhicin.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2.5 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-1/3 h-11 rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/80"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Ka noqo
                        </Button>
                        <Button
                            type="submit"
                            className="w-2/3 h-11 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm transition-all active:scale-[0.99] gap-1.5"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Dirayaa...</span>
                                </>
                            ) : (
                                <>
                                    <span>Xaqiiji Dalabka</span>
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    );
}