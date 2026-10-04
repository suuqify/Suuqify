import { ReactNode } from "react";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
    return <div className="min-h-screen bg-background antialiased">{children}</div>;
}