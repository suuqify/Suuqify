import React from "react";
import Link from "next/link";
import { RecentPaymentItem } from "@/actions/admin/overview";
import { ArrowUpRight, CreditCard } from "lucide-react";

interface RecentPaymentsProps {
    payments: RecentPaymentItem[];
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
    const getBadge = (status: RecentPaymentItem["status"]) => {
        switch (status) {
            case "approved":
                return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-200/60";
            case "rejected":
                return "bg-rose-50 text-rose-700 border-rose-200/60";
        }
    };

    return (
        <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-border/70 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-base text-foreground">Lacagihii Ugu Dambeeyay</h3>
                    <p className="text-xs text-muted-foreground">Dalabyadii lacag bixinta ee ugu dambeeyay</p>
                </div>
                <Link
                    href="/admin/payments"
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                >
                    Dhammaan <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {payments.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center flex-1">
                    <CreditCard className="w-8 h-8 text-muted-foreground/40 mb-2" />
                    Weli ma jiraan wax dalab lacag bixin ah.
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider border-b border-border/60">
                                <tr>
                                    <th className="py-3 px-4 font-medium">Dukaanka</th>
                                    <th className="py-3 px-4 font-medium">Xirmada</th>
                                    <th className="py-3 px-4 font-medium">Qiimaha</th>
                                    <th className="py-3 px-4 font-medium">Habka & Taleefanka</th>
                                    <th className="py-3 px-4 font-medium text-right">Xaaladda</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {payments.map((p) => (
                                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="py-3.5 px-4 font-medium text-foreground">{p.storeName}</td>
                                        <td className="py-3.5 px-4 text-muted-foreground">{p.planName}</td>
                                        <td className="py-3.5 px-4 font-semibold text-foreground">${p.amount}</td>
                                        <td className="py-3.5 px-4 text-xs text-muted-foreground">
                                            <span className="font-medium text-foreground">{p.paymentMethod}</span> ({p.senderPhone})
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <span
                                                className={`inline-block text-[11px] font-medium border px-2.5 py-0.5 rounded-full capitalize ${getBadge(
                                                    p.status
                                                )}`}
                                            >
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card List View */}
                    <div className="md:hidden divide-y divide-border/60">
                        {payments.map((p) => (
                            <div key={p.id} className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm text-foreground">{p.storeName}</span>
                                    <span className="font-bold text-sm text-foreground">${p.amount}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{p.planName} • {p.paymentMethod}</span>
                                    <span
                                        className={`inline-block text-[10px] font-medium border px-2 py-0.5 rounded-full capitalize ${getBadge(
                                            p.status
                                        )}`}
                                    >
                                        {p.status}
                                    </span>
                                </div>
                                <div className="text-[11px] text-muted-foreground font-mono">
                                    Tel: {p.senderPhone}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}