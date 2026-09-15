import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Suuqify - Turn Social Traffic Into Instant Sales",
    template: "%s | Suuqify",
  },
  description:
    "The fastest link-in-bio micro-storefront for modern merchants. Sell effortlessly on TikTok and Instagram with seamless WhatsApp checkout.",
  keywords: [
    "link in bio store",
    "micro storefront",
    "whatsapp checkout",
    "social commerce",
    "somali ecommerce",
    "suuqify",
  ],
  authors: [{ name: "Suuqify" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <main className="flex-1">{children}</main>
        <Toaster position="top-right" richColors closeButton duration={3000} />
      </body>
    </html>
  );
}