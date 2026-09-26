"use client";

import React, { useTransition } from "react";
import { AdminPaymentRecord } from "@/actions/admin/payments";
import { approvePaymentAction, rejectPaymentAction } from "@/actions/admin/payments";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, X, Store, User, Phone, Calendar, CreditCard, Layers } from "lucide-react";

interface PaymentDetailDialogProps {
    payment: AdminPaymentRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

export function PaymentDetailDialog({
    payment,
    isOpen,
    onClose,
}: PaymentDetailDialogProps) {
    const [isPending, startTransition] = useTransition();

    if (!payment) return null;

    const handleApprove = () => {
        startTransition(async () => {
            const res = await approvePaymentAction(payment.id);
            if (res.success) {
                toast.success(res.message);
                onClose();
            } else {
                toast.error(res.error || "Approval failed");
            }
        });
    };

    const handleReject = () => {
        startTransition(async () => {
            const res = await rejectPaymentAction(payment.id);
            if (res.success) {
                toast.success(res.message);
                onClose();
            } else {
                toast.error(res.error || "Rejection failed");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg rounded-2xl p-6">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-bold">Payment Request Details</DialogTitle>
                        <Badge
                            variant="outline"
                            className={`capitalize px-2.5 py-0.5 font-medium ${payment.status === "approved"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : payment.status === "pending"
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-rose-50 text-rose-700 border-rose-200"
                                }`}
                        >
                            {payment.status}
                        </Badge>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Transaction ID: {payment.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Store & Owner Details Card */}
                    <div className="bg-muted/40 rounded-xl p-4 border border-border/60 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <Store className="w-3.5 h-3.5" />
                            <span>Store Information</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-xs text-muted-foreground block">Store Name</span>
                                <span className="font-semibold text-foreground">{payment.store.name}</span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">City & Category</span>
                                <span className="text-foreground">
                                    {payment.store.city} • {payment.store.category}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">Owner Full Name</span>
                                <span className="text-foreground flex items-center gap-1">
                                    <User className="w-3 h-3 text-muted-foreground" />
                                    {payment.store.owner.fullName}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">WhatsApp Number</span>
                                <span className="text-foreground flex items-center gap-1 font-mono text-xs">
                                    <Phone className="w-3 h-3 text-muted-foreground" />
                                    {payment.store.whatsappNumber}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Plan Details Card */}
                    <div className="bg-muted/40 rounded-xl p-4 border border-border/60 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Payment & Plan Breakdown</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-xs text-muted-foreground block">Selected Plan</span>
                                <span className="font-semibold text-primary flex items-center gap-1">
                                    <Layers className="w-3.5 h-3.5" />
                                    {payment.plan.name} (${payment.plan.price})
                                </span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">Plan Duration</span>
                                <span className="text-foreground">{payment.plan.duration} Days</span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">Payment Method</span>
                                <span className="font-medium text-foreground">{payment.paymentMethod}</span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">Sender Phone</span>
                                <span className="font-mono font-bold text-foreground text-sm">
                                    {payment.senderPhone}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">Amount Paid</span>
                                <span className="text-lg font-extrabold text-foreground">${payment.amount}</span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">Submitted At</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(payment.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons (Only for Pending) */}
                {payment.status === "pending" ? (
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            disabled={isPending}
                            onClick={handleReject}
                            className="text-rose-600 border-rose-200 hover:bg-rose-50"
                        >
                            <X className="w-4 h-4 mr-1.5" />
                            Reject Payment
                        </Button>
                        <Button
                            disabled={isPending}
                            onClick={handleApprove}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        >
                            <Check className="w-4 h-4 mr-1.5" />
                            Approve & Activate
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-2 text-xs text-muted-foreground">
                        This transaction is already <span className="font-semibold">{payment.status}</span>.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}