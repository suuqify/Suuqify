import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Hubi in isticmaalahani leeyahay dukaan
                const { data: store } = await supabase
                    .from("stores")
                    .select("id")
                    .eq("owner_id", user.id)
                    .single();

                // Haddaanu lahayn -> Onboarding, hadduu leeyahay -> Store Dashboard
                if (!store) {
                    return NextResponse.redirect(`${origin}/onboarding`);
                }
                return NextResponse.redirect(`${origin}/store`);
            }
        }
    }

    return NextResponse.redirect(`${origin}/signin?error=auth_failed`);
}