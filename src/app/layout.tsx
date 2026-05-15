import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://restaurantsdeschefs.pages.dev";
const siteDescription =
  "Restaurants, Top Chef et étoilés Michelin sur une carte interactive.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "L'annuaire des Grands Chefs",
  description: siteDescription,
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "L'annuaire des Grands Chefs",
    title: "L'annuaire des Grands Chefs",
    description: siteDescription,
    images: [
      {
        url: "/og-image.png?v=2",
        width: 512,
        height: 512,
        alt: "L'annuaire des Grands Chefs — logo toque",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "L'annuaire des Grands Chefs",
    description: siteDescription,
    images: ["/og-image.png?v=2"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Annuaire Grands Chefs",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body
        className={`${inter.className} min-h-full flex flex-col bg-rc-page text-rc-text font-normal`}
      >
        <div className="flex min-h-full flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
