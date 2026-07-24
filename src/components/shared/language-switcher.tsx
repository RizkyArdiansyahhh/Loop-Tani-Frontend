"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ isTransparent }: { isTransparent?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function changeLanguage(newLocale: "id" | "en") {
    router.replace(pathname, { locale: newLocale });
  }

  const languages = [
    { code: "id" as const, label: "Indonesia", flag: "🇮🇩" },
    { code: "en" as const, label: "English", flag: "🇺🇸" },
  ];

  const active = languages.find((l) => l.code === locale);

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "h-8 gap-1.5 px-2.5 text-sm transition-colors duration-300",
              isTransparent
                ? "text-white bg-transparent hover:bg-white/10 hover:text-white data-[state=open]:text-white/80"
                : "bg-transparent"
            )}
          >
            <Globe className="size-4" />
            {active?.label}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                {languages.map((lang) => (
                  <NavigationMenuLink
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="flex-row items-center gap-2"
                  >
                    <span className="text-base">{lang.flag}</span>
                    {lang.label}
                  </NavigationMenuLink>
                ))}
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
