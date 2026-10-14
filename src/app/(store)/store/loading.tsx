import { Loader2 } from "lucide-react";

export default function StoreLoading() {
    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            {/* Spinning Brand Icon */}
            <div className="relative flex items-center justify-center">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            </div>

            {/* Loading text */}
           <div className="text-center space-y-1">
    <p className="text-xs font-semibold text-foreground tracking-wide">
        Bogga ayaa soo furmaya...
    </p>
    <p className="text-[11px] text-muted-foreground">
        Fadlan sug ilbiriqsiyo
    </p>
</div>
        </div>
    );
}