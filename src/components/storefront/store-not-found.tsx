import Link from "next/link";
import { Store, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoreNotFoundProps {
    title?: string;
    message?: string;
}

export function StoreNotFound({
    title = "Website-kani Si Ku-Meel-Gaar ah Ayuu u Xiran Yahay",
message = "Boggani hadda ma shaqaynayo. Fadlan dib ugu soo laabo goor dhow.",
}: StoreNotFoundProps) {
    return (
        <main className="min-h-screen w-full bg-muted/20 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md flex flex-col items-center text-center">

                {/* Icon Container */}
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-muted border border-border/50 text-muted-foreground mb-5 shadow-sm">
                    <Store className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.75]" />
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {title}
                </h1>

                {/* Message */}
                <p className="text-sm sm:text-base text-muted-foreground mt-2 mb-6 leading-relaxed max-w-sm sm:max-w-md">
                    {message}
                </p>

                {/* Button Fix: Link-ga ayaa banaanka yaalla si TypeScript uusan qalad u bixin */}
                <Link href="/" className="inline-block">
                    <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-2 rounded-xl shadow-sm px-6 h-11 border-border/70 cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4 shrink-0" />
                        <span className="whitespace-nowrap">Ku noqo Bogga Hore</span>
                    </Button>
                </Link>

            </div>
        </main>
    );
}