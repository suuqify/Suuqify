import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://suuqify.online"),
  title: {
    default: "Suuqify - Modern Digital Storefront & WhatsApp Commerce",
    template: "%s | Suuqify",
  },
  description:
    "The leading digital storefront platform for modern businesses and merchants. Showcase your products and services effortlessly with seamless, instant WhatsApp checkout.",
  keywords: [
    "digital storefront",
    "whatsapp store",
    "online storefront",
    "whatsapp checkout",
    "social commerce",
    "somali ecommerce",
    "suuqify",
  ],
  authors: [{ name: "Suuqify" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Suuqify",
  },
  openGraph: {
    title: "Suuqify - Modern Digital Storefront & WhatsApp Commerce",
    description:
      "Turn your social traffic into instant sales. Create your online storefront in minutes and receive direct WhatsApp orders.",
    url: "https://suuqify.online",
    siteName: "Suuqify",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Suuqify Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suuqify - Modern Digital Storefront",
    description: "Launch your modern business storefront with instant WhatsApp checkout.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Suuqify" />
      </head>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <main className="flex-1">{children}</main>
        <Toaster position="top-right" richColors closeButton duration={3000} />
      </body>
    </html>
  );
}