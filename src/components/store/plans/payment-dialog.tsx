"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Check,
    Copy,
    Loader2,
    Smartphone,
    ShieldCheck,
    ArrowRight,
    MessageCircle,
    Hash
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
import { submitPaymentAction } from "@/actions/store/plans";
import { Plan } from "./types";

interface PaymentDialogProps {
    plan: Plan | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const HORMUUD_NUMBER = "613940257";
const SUPPORT_WHATSAPP = "252613940257";

export function PaymentDialog({ plan, open, onOpenChange }: PaymentDialogProps) {
    const router = useRouter();
    const [senderPhone, setSenderPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);

    if (!plan) return null;

    const ussdString = `*712*${HORMUUD_NUMBER}*${plan.price}#`;

    const handleCopyUSSD = () => {
        navigator.clipboard.writeText(ussdString);
        setCopiedCode(true);
        toast.success("Koodhka waa la koobiyeeyay!");
        setTimeout(() => setCopiedCode(false), 2000);
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
                paymentMethod: "EVC Plus",
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

    const whatsappHelpMessage = encodeURIComponent(
        `Asc Suuqify, "${plan.name}" ($${plan.price}) waxaan rabaa inaan Xirmada Lacag bixinta aan ku bixiyo Zaad / Sahal / eDahab. Fadlan ii soo dira akoonka number.`
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Waxaan saxnay padding-ka mobile-ka (p-4) iyo max-width ([460px]) */}
            <DialogContent className="w-[calc(100%-1.5rem)] sm:max-w-460px p-4 sm:p-6 rounded-2xl sm:rounded-3xl max-h-[92vh] overflow-y-auto border border-border shadow-2xl">

                {/* Header-ka oo boos looga tagay badhanka Close 'X' ee kore */}
                <DialogHeader className="pr-6 space-y-1.5 text-left">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <span className="text-[10px] font-bold text-primary tracking-wider uppercase">
                                Xaqiijinta Lacag-Bixinta
                            </span>
                            <DialogTitle className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                                {plan.name}
                            </DialogTitle>
                        </div>

                        {/* Price Badge - Compact & Responsive */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-2.5 py-1 text-right shrink-0">
                            <span className="text-[9px] uppercase font-bold text-emerald-600 block leading-tight">
                                Qiimaha
                            </span>
                            <span className="text-base sm:text-lg font-black text-emerald-600">
                                ${plan.price}
                            </span>
                        </div>
                    </div>

                    <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground leading-normal">
                        Fadlan Numbarkan hoose ku dir lacagta, kadibna lambarkaa kasoo dirtay foomka ku xaqiiji.
                    </DialogDescription>
                </DialogHeader>

                {/* USSD Box - responsive font & tap-to-copy */}
                <div className="mt-2 space-y-1.5">
                    <div className="rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/0.04 p-2.5 sm:p-3">
                        <div className="flex items-center justify-between text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                            <span className="flex items-center gap-1.5 font-semibold">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                EVC Plus (Hormuud)
                            </span>
                            <span className="text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-400 font-medium">
                                Hal-gujis ku dir
                            </span>
                        </div>

                        {/* Koodhka & Badhanka Koobiyaynta */}
                        <div
                            onClick={handleCopyUSSD}
                            className="flex items-center justify-between gap-1.5 bg-background border border-emerald-500/30 rounded-lg p-2 sm:p-2.5 cursor-pointer active:scale-[0.99] hover:border-emerald-500 transition-all select-none"
                            title="Guji si aad u koobiyeysato"
                        >
                            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                                <div className="h-6 w-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Hash className="h-3.5 w-3.5" />
                                </div>
                                <span className="font-mono text-xs sm:text-sm font-bold tracking-tight text-foreground truncate select-all">
                                    {ussdString}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="h-7 px-2 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 shrink-0 transition-colors"
                            >
                                {copiedCode ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                        <span>Koobiyaysan</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>Koobiye</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form-ka */}
                <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                    <div className="space-y-1">
                        <Label htmlFor="sender_phone" className="text-xs font-medium text-foreground">
                            Lambarka aad Lacagta Ka Soo Dirtay
                        </Label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="sender_phone"
                                type="tel"
                                placeholder="061XXXXXXX"
                                value={senderPhone}
                                onChange={(e) => setSenderPhone(e.target.value)}
                                className="pl-9 h-10 rounded-xl bg-background border-border text-xs sm:text-sm font-mono tracking-wide"
                                required
                            />
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1 pt-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                            Waxa lagu xaqiijinayaa lambarkan.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-10 rounded-xl text-xs font-medium"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Ka noqo
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-10 rounded-xl text-xs font-semibold bg-primary text-primary-foreground gap-1.5 shadow-sm"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Dirayaa...</span>
                                </>
                            ) : (
                                <>
                                    <span>Xaqiiji</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Qaybta WhatsApp - Compact & Clean */}
                <div className="mt-1 pt-2.5 border-t border-border/60">
                    <div className="bg-muted/40 rounded-xl p-2.5 flex flex-col xs:flex-row items-center justify-between gap-2">
                        <div className="text-center xs:text-left">
                            <p className="text-[11px] font-semibold text-foreground leading-tight">
                                Ma doonaysaa inaad ku bixiso Zaad, Sahal ama eDahab?
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                                Fadlan WhatsApp nagala soo xiriir si ganacsigaagu u sii shaqeeyo.
                            </p>
                        </div>

                        <a
                            href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${whatsappHelpMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full xs:w-auto inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-xs transition-colors"
                        >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}