import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";

export const metadata: Metadata = {
  title: "Suuqify - Link-in-Bio Micro-Storefront ee Ganacsatada Casriga ah",
  description:
    "Ku iibi alaabtaada TikTok iyo Instagram si toos ah. U sameyso dukaan Link-in-bio ah oo macaamiishu hal gujiso kaga dalban karaan WhatsApp adigoo lacagta ku helaya EVC Plus, Zaad, ama Sahal.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
    </>
  );
}