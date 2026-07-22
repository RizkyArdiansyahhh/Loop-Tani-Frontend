"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { PiTiktokLogo } from "react-icons/pi";
import { Mail, MapPin, Phone, ArrowRight, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
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
    <footer className="relative mt-28 border-t border-emerald-100 bg-gradient-to-b from-white via-emerald-50/10 to-emerald-50/20 dark:from-slate-950 dark:via-slate-950/90 dark:to-emerald-950/10 overflow-hidden transition-colors duration-300">
      {/* ── Background Glow & Patterns ── */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/5 dark:bg-emerald-500/3 blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/5 dark:bg-primary/3 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-16 relative z-10">
        {/* ── Top Section: Brand & Newsletter Subscription ── */}
        <div className="grid gap-8 lg:grid-cols-12 items-center border-b border-emerald-100/50 dark:border-slate-800/60 pb-12 mb-12">
          <div className="lg:col-span-5 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/images/logo-putih.png"
                alt="LoopTani Logo"
                className="h-10 invert dark:invert-0 transition-all duration-300"
              />
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
              Marketplace digital sirkular terpadu yang memberdayakan petani, industri pengolahan organik, dan melacak emisi lingkungan secara real-time.
            </p>
          </div>

          <div className="lg:col-span-7 text-left lg:text-right space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Berlangganan Buletin Sirkular Tani
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dapatkan update mingguan tren pasar limbah pertanian, harga jual, dan kiat budidaya hijau.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex max-w-md ml-auto mr-0 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/45 transition-all duration-300"
            >
              <input
                type="email"
                placeholder="Alamat email Anda..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-transparent px-3 text-xs text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-emerald-700 text-white rounded-lg h-9 px-4 font-bold text-xs shadow-xs"
              >
                {subscribed ? (
                  "Berhasil!"
                ) : (
                  <>
                    Subscribe
                    <Send className="ml-1.5 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* ── Main Footer Grid ── */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-left">
          {/* Brand Info & Social Media */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">
                LoopTani Ecosystem
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Membangun masa depan agrikultur lestari dari Riau untuk Indonesia. Mengubah ampas kopi, jerami, dan sekam menjadi komoditas berkelanjutan.
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-3xs transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md hover:shadow-emerald-500/20 cursor-pointer"
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
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">
              Marketplace Sirkular
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { href: "/marketplace", label: "Semua Produk" },
                { href: "/marketplace?category=agricultural-waste", label: "Limbah Pertanian" },
                { href: "/marketplace?category=processed-product", label: "Produk Olahan" },
                { href: "/marketplace?category=secondhand", label: "Alat Secondhand" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="flex items-center text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors group w-fit"
                  >
                    <ArrowRight className="h-3 w-3 mr-1.5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help & Terms */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">
              Bantuan & Panduan
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { href: "/about", label: "Tentang Kami" },
                { href: "#", label: "FAQ & Pusat Bantuan" },
                { href: "#", label: "Kebijakan Privasi" },
                { href: "#", label: "Syarat & Ketentuan" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="flex items-center text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors group w-fit"
                  >
                    <ArrowRight className="h-3 w-3 mr-1.5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">
              Hubungi LoopTani
            </h4>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-primary shrink-0">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Telepon</p>
                  <p className="text-slate-500 dark:text-slate-400">+62 812-3456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-primary shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Email Resmi</p>
                  <p className="text-slate-500 dark:text-slate-400">hello@looptani.id</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-primary shrink-0">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Alamat Kantor</p>
                  <p className="text-slate-500 dark:text-slate-400">Pekanbaru, Riau, Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-emerald-100/50 dark:bg-slate-800/60" />

        {/* ── Bottom Section: Copyright & Legal Link ── */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 md:flex-row">
          <p className="flex items-center gap-1">
            <span>© {new Date().getFullYear()}</span>
            <strong className="text-slate-700 dark:text-slate-200">LoopTani</strong>.
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 animate-pulse shrink-0" />
            <span>for Sustainable Agriculture.</span>
          </p>

          <div className="flex gap-4 sm:gap-6 font-medium">
            <Link href="#" className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="#" className="hover:text-primary transition-colors">
              Syarat Penggunaan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
