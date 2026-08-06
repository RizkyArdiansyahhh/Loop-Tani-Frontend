import "./[locale]/globals.css";
import NotFound from "./[locale]/not-found";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default async function RootNotFound() {
  const messages = await getMessages({ locale: routing.defaultLocale });

  return (
    <html lang={routing.defaultLocale}>
      <body>
        <NextIntlClientProvider locale={routing.defaultLocale} messages={messages}>
          <NotFound />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

