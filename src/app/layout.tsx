import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ThemeInitializer } from "@/components/theme/ThemeToggle";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#fbf8f1" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Champion Hair Salon | Established 1998 | Sachin Mahaley",
    template: "%s | Champion Hair Salon",
  },
  description:
    "Champion Hair Salon, established in 1998 by Sachin Mahaley. Master barber haircuts, beard sculpting, traditional shaving, hair colouring, and head massage in a premium grooming atmosphere.",
  keywords: [
    "Champion Hair Salon",
    "Sachin Mahaley barber",
    "Men salon since 1998",
    "Barber shop Maharashtra",
    "Hair cut",
    "Beard trimming",
    "Head massage",
    "Facial for men",
    "Salon appointment booking",
  ],
  authors: [{ name: "Sachin Mahaley", url: "https://championhairsalon.com" }],
  creator: "Champion Hair Salon",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Champion Hair Salon",
    title: "Champion Hair Salon | Established 1998 | Sachin Mahaley",
    description:
      "Where Tradition Meets Excellence in Men's Grooming. Precision haircuts, beard styling, traditional shaving, and relaxing head massage.",
    images: [
      {
        url: "/images/salon-storefront.jpg",
        width: 1200,
        height: 630,
        alt: "Champion Hair Salon Storefront Since 1998",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Champion Hair Salon | Since 1998",
    description: "Premium Men's Grooming & Master Barber Craftsmanship by Sachin Mahaley.",
    images: ["/images/salon-storefront.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-[#050505] text-white flex flex-col antialiased selection:bg-[#D4AF37] selection:text-black"
        suppressHydrationWarning
      >
        <ThemeInitializer />
        {children}
      </body>
    </html>
  );
}
