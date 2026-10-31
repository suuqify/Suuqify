"use server";

import webpush from "web-push";
import { createClient } from "@/utils/supabase/server";

// Furayaashaada rasmiga ah oo toos ugu dhex jira koodhka (Hardcoded for 100% reliability)
const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BNWgdyueoli-QJVS-CQZN1VGaRQ2lrLvO2Y8-YBT5yTFbdntqk6Yu0ezxD6gIXFeS8gEQyiIeH_k-mwk5vAYH2c";

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY ||
  "2oWc1dUjaGzSM-D1IoonRU435earf-8aZ4WfbFVJZYk";

const VAPID_SUBJECT = "mailto:suuqify.so@gmail.com";

// Qalabee Web Push isla marka faylka la akhriyo
try {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} catch (e) {
  console.error("VAPID Setup Error:", e);
}

// 1. Keydi Taleefanka Admin-ka
export async function saveAdminSubscriptionAction(subscription: any) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Fadlan soo gal akoonkaaga." };

    // Tirtir subscriptions-kii hore ee isla admin-kan si aysan u laban-laabmin
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
    console.error("Save subscription error:", err);
    return { success: false, error: err.message };
  }
}

// 2. Shaqada Ogeysiiska tooska ah u diraysa Taleefanka iPhone-kaaga
export async function sendAdminPushNotification(
  title: string,
  body: string,
  url: string = "/admin"
) {
  try {
    // Dib u xaqiiji setVapidDetails ka hor inta aan la dirin
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    const supabase = await createClient();

    // Soo qaad dhammaan aaladaha admin-ka
    const { data: rows, error } = await supabase
      .from("admin_push_subscriptions")
      .select("subscription");

    if (error || !rows || rows.length === 0) {
      console.log("No devices found to notify.");
      return;
    }

    const payload = JSON.stringify({
      title,
      body,
      url,
    });

    // U wada dir dhammaan taleefannada
    for (const r of rows) {
      try {
        const sub = typeof r.subscription === "string" ? JSON.parse(r.subscription) : r.subscription;
        await webpush.sendNotification(sub, payload);
        console.log("✅ Push notification sent successfully to iPhone!");
      } catch (e: any) {
        console.error("Push delivery error:", e?.statusCode, e?.body || e?.message);
      }
    }
  } catch (err) {
    console.error("Global Push Notification Error:", err);
  }
}

// 3. Test Action oo aad hal gujis ku tijaabin karto hadda
export async function testPushNotificationAction() {
  await sendAdminPushNotification(
    "🔔 Tijaabo Ogeysiis!",
    "Hambalyo! Ogeysiisyada Suuqify si buuxda ayay ugu shaqeynayaan iPhone-kaaga.",
    "/admin"
  );
  return { success: true };
}