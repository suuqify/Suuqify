export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xs">
                {children}
            </div>
        </div>
    );
}