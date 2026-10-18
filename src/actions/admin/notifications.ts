"use server";

import webpush from "web-push";
import { createClient } from "@/utils/supabase/server";

// Qalabee Web Push
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:support@suuqify.online",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

// 1. Keydi Taleefanka Admin-ka
export async function saveAdminSubscriptionAction(subscription: any) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Tirtir kuwii hore ee isla qalabkan si aysan u laban-laabmin
    await supabase
      .from("admin_push_subscriptions")
      .delete()
      .eq("admin_id", user.id);

    const { error } = await supabase.from("admin_push_subscriptions").insert({
      admin_id: user.id,
      subscription: subscription,
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 2. Shaqada Ogeysiiska u diraysa Taleefanka Admin-ka
export async function sendAdminPushNotification(title: string, body: string, url: string = "/admin") {
  try {
    const supabase = await createClient();

    // Soo qaad dhammaan subscriptions-ka Admin-yada
    const { data: subscriptions } = await supabase
      .from("admin_push_subscriptions")
      .select("subscription");

    if (!subscriptions || subscriptions.length === 0) return;

    const payload = JSON.stringify({ title, body, url });

    // U wada dir dhammaan taleefannada admin-ka
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub.subscription as any, payload);
      } catch (e: any) {
        console.error("Push Error on device:", e.statusCode);
      }
    }
  } catch (err) {
    console.error("Global Push Notification Error:", err);
  }
}