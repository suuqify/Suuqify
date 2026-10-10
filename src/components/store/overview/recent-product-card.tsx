import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, Plus } from "lucide-react";
import { StoreOverviewData } from "@/actions/store/overview";
import { Button } from "@/components/ui/button";

interface RecentProductsCardProps {
    products: StoreOverviewData["recentProducts"];
}

export function RecentProductsCard({ products }: RecentProductsCardProps) {
    return (
        <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-border/70 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-base text-foreground">Kuwii Ugu Dambeeyay</h3>
<p className="text-xs text-muted-foreground">Waxyaabihii aad dhawaan ku dartay ganacsigaaga</p>
                </div>
                <Link
                    href="/store/products"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                    Dhammaan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center">
                    <Package className="w-10 h-10 text-muted-foreground/40 mb-3" />
                    <p className="font-medium text-foreground">Weli wax alaab ama adeeg ah kuma aadan darin Ganacsigaaga.</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                        Bilow hadda oo soo bandhig waxa aad u haysid macaamiishaada.
                    </p>
                    <Link href="/store/products">
                        <Button size="sm" className="rounded-xl text-xs bg-primary text-primary-foreground font-semibold gap-1.5">
                            <Plus className="w-4 h-4" /> Add New
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="divide-y divide-border/60">
                    {products.map((p) => (
                        <div key={p.id} className="p-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                {/* Halkan ayaa la saxay: haddii p.image bannaan yahay Icon ayaa galaya */}
                                <div className="h-12 w-12 rounded-xl bg-muted border border-border/70 overflow-hidden relative shrink-0 flex items-center justify-center">
                                    {p.image && p.image.trim() !== "" ? (
                                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                                    ) : (
                                        <Package className="w-5 h-5 text-muted-foreground/50" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">{p.name}</h4>
                                    <span className="text-xs font-bold text-primary">${p.price}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <span
                                    className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full ${p.inStock
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                        : "bg-rose-50 text-rose-700 border border-rose-200/60"
                                        }`}
                                >
                                    {p.inStock ? "In Stock" : "Dhamaatay"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}