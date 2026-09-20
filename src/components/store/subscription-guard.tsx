"use client";

import { usePathname } from "next/navigation";
import { NoSubscriptionView } from "@/components/store/no-subscription-view";

interface SubscriptionGuardProps {
    children: React.ReactNode;
    hasActiveSub: boolean;
    isExpired: boolean;
    storeName: string;
}

export function SubscriptionGuard({
    children,
    hasActiveSub,
    isExpired,
    storeName,
}: SubscriptionGuardProps) {
    const pathname = usePathname();

    // Bogagga loo ogol yahay inuu maro xataa haddii uusan subscription haysan:
    const allowedPaths = [
        "/store/settings",
        "/store/plans",
        "/store/billing",
        "/store/subscription",
    ];

    // Hubi haddii uu bogaggaas joogo
    const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));

    // Haddii uusan haysan sub oo uusan joogin bogagga loo ogol yahay -> Tus NoSubscriptionView
    if (!hasActiveSub && !isAllowed) {
        return <NoSubscriptionView storeName={storeName} isExpired={isExpired} />;
    }

    // Haddii kale furi barta uu rabo
    return <>{children}</>;
}