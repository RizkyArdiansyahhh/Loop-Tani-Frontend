"use client";

import * as React from "react";
import { useRef, useEffect, useState, type RefObject } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import {
  Menu,
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MegaMenuItem } from "./mega-menu-item";

const components: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Alert Dialog",
    href: "/docs/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/alert-dialog", label: "Alert Dialog" },
  { href: "/docs/hover-card", label: "Hover Card" },
  { href: "/docs/progress", label: "Progress" },
  { href: "/docs/scroll-area", label: "Scroll Area" },
  { href: "/docs/tabs", label: "Tabs" },
  { href: "/docs/tooltip", label: "Tooltip" },
];

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function NavbarContent() {
  const t = useTranslations("auth");
  const t_navbar = useTranslations("navbar");

  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="mx-auto flex w-full items-center justify-between gap-4 px-6 py-3">
      <Link
        href="/"
        className="shrink-0 text-xl font-bold tracking-tight text-gray-900"
      >
        <img src="/images/logo-putih.png" alt="logo" className="h-10" />
      </Link>

      {/* Desktop nav — center */}
      <div className="hidden flex-1 justify-center md:flex">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent font-semibold">
                {t_navbar("marketplace.title")}
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <div className="w-max rounded-xl p-4">
                  <div className="flex divide-x divide-border">
                    {/* Agricultural Waste */}
                    <div className="min-w-[220px] px-6 first:pl-0">
                      <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {t_navbar("marketplace.agriculturalWaste.title")}
                      </h4>

                      <ul className="space-y-3">
                        <MegaMenuItem
                          href="/marketplace/agricultural-waste"
                          label={t_navbar("marketplace.agriculturalWaste.all")}
                        />

                        <MegaMenuItem
                          href="/marketplace/agricultural-waste/rice-straw"
                          label={t_navbar(
                            "marketplace.agriculturalWaste.riceStraw",
                          )}
                        />

                        <MegaMenuItem
                          href="/marketplace/agricultural-waste/rice-husk"
                          label={t_navbar(
                            "marketplace.agriculturalWaste.riceHusk",
                          )}
                        />

                        <MegaMenuItem
                          href="/marketplace/agricultural-waste/oil-palm-efb"
                          label={t_navbar(
                            "marketplace.agriculturalWaste.oilPalmEFB",
                          )}
                        />

                        <MegaMenuItem
                          href="/marketplace/agricultural-waste/manure"
                          label={t_navbar(
                            "marketplace.agriculturalWaste.livestockManure",
                          )}
                        />
                      </ul>
                    </div>

                    {/* Processed Products */}
                    <div className="min-w-[220px] px-6">
                      <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {t_navbar("marketplace.processedProducts.title")}
                      </h4>

                      <ul className="space-y-3">
                        <MegaMenuItem
                          href="/marketplace/processed-products"
                          label={t_navbar("marketplace.processedProducts.all")}
                        />

                        <MegaMenuItem
                          href="/marketplace/processed-products/compost"
                          label={t_navbar(
                            "marketplace.processedProducts.compost",
                          )}
                        />

                        <MegaMenuItem
                          href="/marketplace/processed-products/briquettes"
                          label={t_navbar(
                            "marketplace.processedProducts.biomassBriquettes",
                          )}
                        />

                        <MegaMenuItem
                          href="/marketplace/processed-products/liquid-fertilizer"
                          label={t_navbar(
                            "marketplace.processedProducts.liquidOrganicFertilizer",
                          )}
                        />

                        <MegaMenuItem
                          href="/marketplace/processed-products/silica-ash"
                          label={t_navbar(
                            "marketplace.processedProducts.silicaAsh",
                          )}
                        />
                      </ul>
                    </div>

                    {/* Second-hand Equipment */}
                    <div className="min-w-[220px] px-6 last:pr-0">
                      <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {t_navbar("marketplace.secondhandEquipment.title")}
                      </h4>

                      <ul className="space-y-3">
                        <MegaMenuItem
                          href="/marketplace/equipment"
                          label={t_navbar(
                            "marketplace.secondhandEquipment.all",
                          )}
                        />

                        <MegaMenuItem
                          href="/marketplace/equipment/tractors"
                          label={t_navbar(
                            "marketplace.secondhandEquipment.tractors",
                          )}
                        />

                        <MegaMenuItem
                          href="/marketplace/equipment/planting-tools"
                          label={t_navbar(
                            "marketplace.secondhandEquipment.plantingTools",
                          )}
                        />

                        <MegaMenuItem
                          href="/marketplace/equipment/harvesting-tools"
                          label={t_navbar(
                            "marketplace.secondhandEquipment.harvestingTools",
                          )}
                        />

                        <MegaMenuItem
                          href="/marketplace/equipment/sprayers"
                          label={t_navbar(
                            "marketplace.secondhandEquipment.sprayers",
                          )}
                        />

                        <MegaMenuItem
                          href="/marketplace/equipment/irrigation"
                          label={t_navbar(
                            "marketplace.secondhandEquipment.irrigationEquipment",
                          )}
                        />
                      </ul>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent font-semibold">
                AI Agri-Consultant
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent font-semibold",
                )}
              >
                <Link href="/docs">Panduan tani</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent font-semibold",
                )}
              >
                <Link href="/docs">Jejak Lestari</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent font-semibold",
                )}
              >
                <Link href="/docs">Tentang Kami</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Desktop actions — right */}
      <div className="hidden shrink-0 items-center gap-3 md:flex">
        <LanguageSwitcher />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/login">{t("login.button")}</Link>
        </Button>
        <Button
          size="sm"
          asChild
          className="bg-primary text-background px-6 py-4 font-semibold"
        >
          <Link href="/auth/register">{t("register.button")}</Link>
        </Button>
      </div>

      {/* Mobile hamburger */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-4">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <LanguageSwitcher />
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                {t("login.button")}
              </Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                {t("register.button")}
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function useNavbarObserver(ref: RefObject<HTMLElement | null>): boolean {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isSticky;
}

export default function Navbar() {
  const floatingRef = useRef<HTMLElement>(null);
  const isSticky = useNavbarObserver(floatingRef);

  return (
    <>
      <nav
        ref={floatingRef}
        className="w-full border-b border-gray-200 bg-white"
      >
        <NavbarContent />
      </nav>

      <AnimatePresence>
        {isSticky && (
          <motion.nav
            className="fixed top-0 left-0 right-0 z-[200] border-b border-gray-200 bg-white shadow-sm"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <NavbarContent />
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
