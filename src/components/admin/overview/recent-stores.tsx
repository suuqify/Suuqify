import React from "react";
import Link from "next/link";
import { RecentStoreItem } from "@/actions/admin/overview";
import { ArrowUpRight, BadgeCheck, Store } from "lucide-react";

interface RecentStoresProps {
    stores: RecentStoreItem[];
}

export function RecentStores({ stores }: RecentStoresProps) {
    const getStatusBadge = (status: RecentStoreItem["status"]) => {
        switch (status) {
            case "active":
                return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-200/60";
            case "suspended":
                return "bg-rose-50 text-rose-700 border-rose-200/60";
        }
    };

    return (
        <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-border/70 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-base text-foreground">Ganacsiyadii Ugu Dambeeyay</h3>
                    <p className="text-xs text-muted-foreground">Ganacsiyada dhawaan is diiwaangeliyay</p>
                </div>
                <Link
                    href="/admin/stores"
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                >
                    Dhammaan <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {stores.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center flex-1">
                    <Store className="w-8 h-8 text-muted-foreground/40 mb-2" />
                    Weli ma jiraan Ganacsiyo diiwaangashan.
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider border-b border-border/60">
                                <tr>
                                    <th className="py-3 px-4 font-medium">Ganacsiga</th>
                                    <th className="py-3 px-4 font-medium">Milkiilaha</th>
                                    <th className="py-3 px-4 font-medium">Magaalada & Qaybta</th>
                                    <th className="py-3 px-4 font-medium text-right">Xaaladda</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {stores.map((s) => (
                                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="py-3.5 px-4 font-medium text-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <span>{s.name}</span>
                                                {s.isVerified && (
                                                    <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0 fill-emerald-100" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-muted-foreground">{s.ownerName}</td>
                                        <td className="py-3.5 px-4 text-xs text-muted-foreground">
                                            {s.cityName} • {s.categoryName}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <span
                                                className={`inline-block text-[11px] font-medium border px-2.5 py-0.5 rounded-full capitalize ${getStatusBadge(
                                                    s.status
                                                )}`}
                                            >
                                                {s.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card List View */}
                    <div className="md:hidden divide-y divide-border/60">
                        {stores.map((s) => (
                            <div key={s.id} className="p-4 space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-sm text-foreground">{s.name}</span>
                                        {s.isVerified && (
                                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 fill-emerald-100" />
                                        )}
                                    </div>
                                    <span
                                        className={`inline-block text-[10px] font-medium border px-2 py-0.5 rounded-full capitalize ${getStatusBadge(
                                            s.status
                                        )}`}
                                    >
                                        {s.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Milkiilaha: {s.ownerName}</span>
                                    <span>{s.cityName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}