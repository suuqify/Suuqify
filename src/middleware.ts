import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user, supabase } = await updateSession(request);
    const pathname = request.nextUrl.pathname;

    const isAdminRoute = pathname.startsWith("/admin");
    const isDashboardRoute = pathname.startsWith("/store");
    const isAuthRoute =
        pathname === "/signin" ||
        pathname.startsWith("/auth");

    if (!user && (isAdminRoute || isDashboardRoute)) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/signin";
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        const role = profile?.role ?? "merchant";

        if (isAuthRoute) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = role === "admin" ? "/admin" : "/store";
            return NextResponse.redirect(redirectUrl);
        }

        if (isAdminRoute && role !== "admin") {
            const dashboardUrl = request.nextUrl.clone();
            dashboardUrl.pathname = "/store";
            return NextResponse.redirect(dashboardUrl);
        }

        if (isDashboardRoute && role === "admin") {
            const adminUrl = request.nextUrl.clone();
            adminUrl.pathname = "/admin";
            return NextResponse.redirect(adminUrl);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};