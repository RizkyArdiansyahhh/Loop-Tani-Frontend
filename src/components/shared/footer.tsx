"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { PiTiktokLogo } from "react-icons/pi";
import { Mail, MapPin, Phone, ArrowRight, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300 font-sans select-none">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-16 relative z-10 font-poppins">
        {/* ── Top Section: Brand & Newsletter Subscription ── */}
        <div className="grid gap-8 lg:grid-cols-12 items-center border-b border-stone-200 dark:border-stone-800 pb-12 mb-12">
          <div className="lg:col-span-5 space-y-3">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo-putih.png"
                alt="LoopTani Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-md font-poppins">
              {t("brandDescription")}
            </p>
          </div>

          <div className="lg:col-span-7 text-left lg:text-right space-y-4">
            <h3 className="text-xs sm:text-sm font-extrabold text-stone-950 dark:text-white uppercase tracking-wider font-poppins">
              {t("newsletterTitle")}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-poppins">
              {t("newsletterDesc")}
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex max-w-md ml-auto mr-0 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-1.5 shadow-xs focus-within:ring-2 focus-within:ring-primary/30 transition-all duration-300"
            >
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-transparent px-3 text-xs text-stone-900 dark:text-stone-100 outline-none placeholder:text-stone-400 font-poppins"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-emerald-700 text-white rounded-lg h-9 px-4 font-bold text-xs shadow-xs cursor-pointer"
              >
                {subscribed ? (
                  t("subscribedBtn")
                ) : (
                  <>
                    {t("subscribeBtn")}
                    <Send className="ml-1.5 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* ── Main Footer Grid ── */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-left font-poppins">
          {/* Brand Info & Social Media */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-extrabold text-stone-950 dark:text-white uppercase tracking-widest mb-4 font-poppins">
                {t("ecosystemTitle")}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-poppins">
                {t("ecosystemDesc")}
              </p>
            </div>

            <div className="flex gap-2.5">
              {[
                { href: "#", icon: PiTiktokLogo, name: "TikTok" },
                { href: "#", icon: FaInstagram, name: "Instagram" },
                { href: "#", icon: FaFacebookF, name: "Facebook" },
                { href: "#", icon: FaLinkedinIn, name: "LinkedIn" },
              ].map((social, index) => {
                const IconComp = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md cursor-pointer"
                    aria-label={social.name}
                  >
                    <IconComp className="h-4.5 w-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Marketplace Navigation */}
          <div>
            <h4 className="text-xs font-extrabold text-stone-950 dark:text-white uppercase tracking-widest mb-4 font-poppins">
              {t("marketplaceTitle")}
            </h4>
            <ul className="space-y-2.5 text-xs font-poppins">
              {[
                { href: "/marketplace", label: t("allProducts") },
                {
                  href: "/marketplace?category=agricultural-waste",
                  label: t("agriculturalWaste"),
                },
                {
                  href: "/marketplace?category=processed-product",
                  label: t("processedProduct"),
                },
                {
                  href: "/marketplace?category=secondhand",
                  label: t("secondhand"),
                },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="flex items-center text-stone-600 hover:text-primary dark:text-stone-400 dark:hover:text-primary transition-colors group w-fit font-poppins"
                  >
                    <ArrowRight className="h-3 w-3 mr-1.5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help & Terms */}
          <div>
            <h4 className="text-xs font-extrabold text-stone-950 dark:text-white uppercase tracking-widest mb-4 font-poppins">
              {t("helpTitle")}
            </h4>
            <ul className="space-y-2.5 text-xs font-poppins">
              {[
                { href: "/about", label: t("aboutUs") },
                { href: "#", label: t("faqHelp") },
                { href: "#", label: t("privacyPolicy") },
                { href: "#", label: t("terms") },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="flex items-center text-stone-600 hover:text-primary dark:text-stone-400 dark:hover:text-primary transition-colors group w-fit font-poppins"
                  >
                    <ArrowRight className="h-3 w-3 mr-1.5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div>
            <h4 className="text-xs font-extrabold text-stone-950 dark:text-white uppercase tracking-widest mb-4 font-poppins">
              {t("contactTitle")}
            </h4>
            <div className="space-y-4 text-xs font-poppins">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 text-primary shrink-0">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-bold text-stone-900 dark:text-stone-200">
                    {t("phoneLabel")}
                  </p>
                  <p className="text-stone-600 dark:text-stone-400">
                    +62 812-3456-7890
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 text-primary shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-bold text-stone-900 dark:text-stone-200">
                    {t("emailLabel")}
                  </p>
                  <p className="text-stone-600 dark:text-stone-400">
                    hello@looptani.id
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 text-primary shrink-0">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-bold text-stone-900 dark:text-stone-200">
                    {t("addressLabel")}
                  </p>
                  <p className="text-stone-600 dark:text-stone-400">
                    {t("officeAddress")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-stone-200 dark:bg-stone-800" />

        {/* ── Bottom Section: Copyright & Legal Link ── */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400 md:flex-row font-poppins">
          <p className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()}</span>
            <strong className="text-stone-900 dark:text-white font-poppins font-bold">
              LoopTani
            </strong>
            .<span>{t("madeWith")}</span>
            <Heart className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600 animate-pulse shrink-0" />
            <span>{t("forSustainableAgri")}</span>
          </p>

          <div className="flex gap-4 sm:gap-6 font-medium">
            <Link href="#" className="hover:text-primary transition-colors">
              {t("privacy")}
            </Link>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <Link href="#" className="hover:text-primary transition-colors">
              {t("termsOfUse")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
