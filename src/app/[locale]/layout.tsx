import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, Poppins } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import LoopiFloating from "@/features/chatbot/components/loopi-floating";
import AccessibilityWidget from "@/components/shared/accessibility-widget";
import { Providers } from "@/components/providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
});

const fontFraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
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
      <body
        className={`${fontSans.variable} ${fontFraunces.variable} ${fontPoppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <ReactQueryDevtools initialIsOpen={false} />
            {children}
            <Toaster />
            <LoopiFloating />
            <AccessibilityWidget />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
