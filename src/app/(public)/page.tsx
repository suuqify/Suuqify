// src/app/page.tsx
import { Metadata } from "next";
import { getHomePageDataAction } from "@/actions/public/home";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturedStoresSection } from "@/components/landing/featured-stores-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "Suuqify - Link-in-Bio Micro-Storefront Ganacsatada Soomaaliyeed",
  description:
    "U beddel barahaaga bulshada (TikTok/Instagram) dukaan casri ah oo toos WhatsApp looga dalbado.",
};

export default async function HomePage() {
  const { featuredStores, plans } = await getHomePageDataAction();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <main className="flex-1">
        <HeroSection />
        <FeaturedStoresSection stores={featuredStores} />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection plans={plans} />
        <FAQSection />
        <CTASection />
      </main>
    </div>
  );
}