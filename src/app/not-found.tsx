"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, SearchX, ShoppingBag, PlusCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="relative mx-auto flex max-w-lg flex-col items-center text-center">
                {/* Icon & 404 Badge */}
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-border/80 bg-muted/40 shadow-sm">
                    <SearchX className="h-12 w-12 text-primary" />
                    <span className="absolute -top-2 -right-2 flex h-8 items-center justify-center rounded-full bg-primary px-2.5 text-xs font-bold text-primary-foreground shadow-sm">
                        404
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    Boggan Lama Helin!
                </h1>

                {/* Description */}
                <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                    Waxay u muuqataa in link-ga aad raadinayso uusan jirin, magaca dukaanka si khaldan loo qoray, ama bogga meel kale loo raray.
                </p>

                {/* Hint Box */}
                <div className="mt-6 flex items-center gap-2.5 rounded-2xl border border-border/80 bg-muted/30 px-4 py-3 text-xs sm:text-sm text-muted-foreground">
                    <ShoppingBag className="h-4 w-4 shrink-0 text-primary" />
                    <span>Ma dukaan ayaad raadinaysay? Hubi higgaadda link-ga saxda ah.</span>
                </div>

                <div className="mt-8 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:items-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className={buttonVariants({
                            size: "lg",
                            className: "h-12 px-7 text-base font-semibold rounded-xl gap-2.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer",
                        })}
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Dib u Laabo</span>
                    </button>

                    <Link
                        href="/signin"
                        className={buttonVariants({
                            variant: "outline",
                            size: "lg",
                            className: "h-12 px-7 text-base font-semibold rounded-xl border-border hover:bg-muted active:scale-[0.98] transition-all gap-2",
                        })}
                    >
                        <PlusCircle className="h-5 w-5 text-muted-foreground" />
                        <span>Abuur Dukaankaaga</span>
                    </Link>
                </div>

            </div>
        </div>
    );
}