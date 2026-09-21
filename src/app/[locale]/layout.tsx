import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, Poppins } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ClientOverlays } from "@/components/shared/client-overlays";
import { Providers } from "@/components/providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "LoopTani — Marketplace Sirkular Pertanian",
  description: "Platform jual beli limbah pertanian & produk olahan organik",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontFraunces = Fraunces({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-fraunces",
  display: "swap",
});

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Set the locale for server-side tools
  setRequestLocale(locale);

  // Fetch the translation messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.looptani.id" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.looptani.id" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* LCP hero poster preload - exact match for instant cache hit across devices */}
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/aexisrpt/video/upload/so_0,q_auto:low,f_auto,w_400,c_limit/v1786439414/5104194-uhd_3840_2160_30fps.jpg"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontFraunces.variable} ${fontPoppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextTopLoader
            color="#16a34a"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #16a34a,0 0 5px #16a34a"
            zIndex={99999}
          />
          <Providers>
            {process.env.NODE_ENV === "development" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
            {children}
            <ClientOverlays />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
