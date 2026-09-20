"use client";

import Link from "next/link";
import { AlertCircle, Zap, Receipt, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";

interface NoSubscriptionViewProps {
    storeName: string;
    isExpired?: boolean;
}

export function NoSubscriptionView({ storeName, isExpired = false }: NoSubscriptionViewProps) {
    return (
        <div className="min-h-100dvh flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-md sm:max-w-lg border-border">
                {/* Header Section */}
                <CardHeader className="text-center px-4 sm:px-6 pt-6 pb-4">
                    <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                        <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>

                    <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                        {isExpired ? "Heshiiskaagii Wuu Dhacay!" : "Qorshe Firfircoon Ma Haysatid"}
                    </CardTitle>

                    <CardDescription className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed wrap-break-word">
                        {isExpired
                            ? `Dukaanka "${storeName}" heshiiskii uu ku shaqaynayay wuu dhacay. Fadlan cusboonaysii si dukaankaagu dib ugu hawlgalo.`
                            : `Dukaanka "${storeName}" ma laha xirmo shaqaynaysa hadda. Dooro qorshe si aad u bilowdo soo gelinta alaabta iyo iibka.`}
                    </CardDescription>
                </CardHeader>

                {/* Benefits Section */}
                <CardContent className="px-4 sm:px-6 py-2">
                    <div className="rounded-lg border bg-muted/40 p-4 text-left">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                            Maxaad helaysaa markaad qorshe doorato?
                        </h4>
                        <ul className="text-xs sm:text-sm text-muted-foreground space-y-2 list-disc list-inside">
                            <li>Soo gelinta alaabta dukaankaaga adigoo xor ah.</li>
                            <li>Dalabaadka tooska ah ee WhatsApp-ka macmiilka.</li>
                            <li>Xiriirka tooska ah ee Link-in-bio ee dukaankaaga.</li>
                        </ul>
                    </div>
                </CardContent>

                {/* Actions Footer */}
                <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-4 sm:p-6 border-t mt-4">
                    {/* Primary Action Button */}
                    <Link
                        href="/store/plans"
                        className={buttonVariants({
                            className: "w-full sm:flex-1 justify-center gap-2",
                        })}
                    >
                        <Zap className="h-4 w-4 fill-current" />
                        <span>{isExpired ? "Cusboonaysii Qorshaha" : "Dooro Qorshe Hadda"}</span>
                    </Link>

                    {/* Secondary Action: Billing */}
                    <Link
                        href="/store/billing"
                        className={buttonVariants({
                            variant: "outline",
                            className: "w-full sm:w-auto justify-center gap-2",
                        })}
                    >
                        <Receipt className="h-4 w-4" />
                        <span>Billing</span>
                    </Link>

                    {/* Logout Button */}
                    <form
                        action={async () => {
                            await signOutAction();
                        }}
                        className="w-full sm:w-auto"
                    >
                        <Button
                            variant="ghost"
                            type="submit"
                            title="Ka bax"
                            className="w-full sm:w-auto justify-center text-muted-foreground hover:text-foreground gap-2 px-3"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="sm:hidden text-sm">Ka bax</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}