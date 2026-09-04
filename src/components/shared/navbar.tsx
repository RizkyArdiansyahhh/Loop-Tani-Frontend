"use client";

import * as React from "react";
import { useRef, useEffect, useState, type RefObject } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ShoppingCart, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/features/cart/hooks/use-cart";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "AI Chatbot Loopi",
    href: "/loopi",
    description:
      "Asisten virtual pintar untuk menjawab segala pertanyaan pertanian Anda secara instan.",
  },
  {
    title: "Limbah Analyzer",
    href: "/limbah-analyzer",
    description:
      "Ukur potensi ekonomi limbah pertanian Anda menggunakan pemrosesan gambar AI.",
  },
  {
    title: "Kalkulator Pupuk",
    href: "/fertilizer-calculator",
    description:
      "Hitung rekomendasi dosis pupuk optimal berdasarkan komoditas dan kondisi tanah.",
  },
];

const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/loopi", label: "AI Loopi" },
  { href: "/limbah-analyzer", label: "Limbah Analyzer" },
  { href: "/fertilizer-calculator", label: "Kalkulator Pupuk" },
  { href: "/panduan-tani", label: "Panduan Tani" },
  { href: "/jejak-lestari", label: "Jejak Lestari" },
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
          <div className="text-sm leading-none font-medium text-gray-900 dark:text-white">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function NavbarContent({ isTransparent }: { isTransparent?: boolean }) {
  const t = useTranslations("auth");
  const t_navbar = useTranslations("navbar");
  const { data: session } = authClient.useSession();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mx-auto flex w-full items-center justify-between gap-4 px-6 py-3">
      <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        <img
          src="/images/logo-putih.png"
          alt="LoopTani Logo"
          className="h-10"
        />
      </Link>

      {/* Desktop nav — center */}
      <div className="hidden flex-1 justify-center lg:flex">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent font-semibold transition-colors duration-300",
                  isTransparent
                    ? "text-white hover:text-white/80 hover:bg-white/10"
                    : "text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary",
                )}
              >
                <Link href="/marketplace">{t_navbar("marketplace.title")}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger
                onPointerDown={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
                className={cn(
                  "bg-transparent font-semibold transition-colors duration-300",
                  isTransparent
                    ? "text-white hover:text-white/80 hover:bg-white/10 data-[state=open]:text-white/80"
                    : "text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary",
                )}
              >
                AI Agri-Consultant
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                  "bg-transparent font-semibold transition-colors duration-300",
                  isTransparent
                    ? "text-white hover:text-white/80 hover:bg-white/10"
                    : "text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary",
                )}
              >
                <Link href="/panduan-tani">Panduan Tani</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent font-semibold transition-colors duration-300",
                  isTransparent
                    ? "text-white hover:text-white/80 hover:bg-white/10"
                    : "text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary",
                )}
              >
                <Link href="/jejak-lestari">Jejak Lestari</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent font-semibold transition-colors duration-300",
                  isTransparent
                    ? "text-white hover:text-white/80 hover:bg-white/10"
                    : "text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary",
                )}
              >
                <Link href="/docs">Tentang Kami</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Desktop actions — right */}
      <div className="hidden shrink-0 items-center gap-3 lg:flex">
        <LanguageSwitcher isTransparent={isTransparent} />
        {session ? (
          <>
            <CartBadge isTransparent={isTransparent} />
            <div
              className={cn(
                "h-6 w-px mx-1 transition-colors duration-300",
                isTransparent
                  ? "bg-white/25"
                  : "bg-gray-200 dark:bg-gray-800",
              )}
            />
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center hover:opacity-80 transition-opacity cursor-pointer focus:outline-hidden"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-800"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-400">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-56 bg-white border border-gray-150 rounded-xl shadow-lg py-2 z-50 dark:bg-gray-900 dark:border-gray-850"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800/80">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {session.user.name}
                      </p>
                      <p className="text-3xs text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/60"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Profil Saya
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800/80 my-1" />

                    <div className="px-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          authClient.signOut();
                        }}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-750 dark:text-red-400 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                      >
                        Keluar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "transition-colors duration-300",
                isTransparent
                  ? "text-white hover:bg-white/10 hover:text-white"
                  : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
            >
              <Link href="/login">{t("login.button")}</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className={cn(
                "bg-primary text-background px-6 py-4 font-semibold hover:bg-emerald-700 transition-colors duration-300",
                isTransparent ? "text-white" : "",
              )}
            >
              <Link href="/register">{t("register.button")}</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen((prev) => !prev)}
        className={cn(
          "shrink-0 lg:hidden transition-colors duration-300",
          isTransparent
            ? "text-white hover:bg-white/10"
            : "text-gray-900 dark:text-white",
        )}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Dropdown Modal style menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-full right-4 w-[85vw] max-w-[360px] sm:w-[320px] z-150 mt-3 overflow-hidden rounded-3xl border border-gray-150 bg-white/95 p-6 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95 lg:hidden"
          >
            <nav className="flex flex-col gap-4">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 h-px w-full bg-gray-100 dark:bg-gray-800" />
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Bahasa / Language
                </span>
                <LanguageSwitcher />
              </div>
              {session ? (
                <div className="flex flex-col gap-3 mt-2">
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="rounded-2xl h-11 w-full"
                  >
                    <Link href="/profile" onClick={() => setMobileOpen(false)}>
                      <User className="h-4.5 w-4.5 mr-2 text-primary" />
                      Profil Saya
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="rounded-2xl h-11 w-full"
                  >
                    <Link href="/cart" onClick={() => setMobileOpen(false)}>
                      <ShoppingCart className="h-4.5 w-4.5 mr-2 text-primary" />
                      Keranjang Belanja
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => {
                      authClient.signOut();
                      setMobileOpen(false);
                    }}
                    className="rounded-2xl h-11 w-full bg-red-600 text-white hover:bg-red-700"
                  >
                    Keluar
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="rounded-2xl h-11"
                  >
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      {t("login.button")}
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    asChild
                    className="rounded-2xl h-11"
                  >
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      {t("register.button")}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/id" || pathname === "/en";
  const isTransparent = isHome && !isSticky;

  return (
    <>
      <nav
        ref={floatingRef}
        className={cn(
          "relative z-50 w-full transition-all duration-300",
          isTransparent
            ? "border-b border-transparent bg-transparent"
            : "border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950",
        )}
      >
        <NavbarContent isTransparent={isTransparent} />
      </nav>

      <AnimatePresence>
        {isSticky && (
          <motion.nav
            className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <NavbarContent isTransparent={false} />
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function CartBadge({ isTransparent }: { isTransparent?: boolean }) {
  const { data } = useCart();
  const count = data?.summary?.totalItems ?? 0;

  return (
    <Link
      href="/cart"
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-105",
        isTransparent
          ? "text-white hover:bg-white/10"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
      )}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-in scale-in duration-300">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
