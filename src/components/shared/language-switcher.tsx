"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function changeLanguage(newLocale: "id" | "en") {
    router.replace(pathname, {
      locale: newLocale,
    });
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage("id")}
        className={locale === "id" ? "font-bold" : ""}
      >
        🇮🇩 ID
      </button>

      <button
        onClick={() => changeLanguage("en")}
        className={locale === "en" ? "font-bold" : ""}
      >
        🇺🇸 EN
      </button>
    </div>
  );
}