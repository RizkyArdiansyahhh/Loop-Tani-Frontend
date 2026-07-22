"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  Leaf,
  Target,
  Compass,
  ShieldCheck,
  TrendingUp,
  Users,
  Bot,
  Store,
  Calculator,
  TreeDeciduous,
  ArrowRight,
  CheckCircle2,
  Globe,
  Building2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function AboutPage() {
  const t = useTranslations("about");

  const stats = [
    {
      label: t("stats.wasteProcessed"),
      value: t("stats.wasteProcessedVal"),
      icon: Leaf,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-600",
    },
    {
      label: t("stats.farmersEmpowered"),
      value: t("stats.farmersEmpoweredVal"),
      icon: Users,
      color: "from-blue-500/20 to-cyan-500/20 text-blue-600",
    },
    {
      label: t("stats.emissionsReduced"),
      value: t("stats.emissionsReducedVal"),
      icon: TreeDeciduous,
      color: "from-amber-500/20 to-orange-500/20 text-amber-600",
    },
    {
      label: t("stats.economicCreated"),
      value: t("stats.economicCreatedVal"),
      icon: TrendingUp,
      color: "from-purple-500/20 to-indigo-500/20 text-purple-600",
    },
  ];

  const pillars = [
    {
      title: t("pillars.analyzerTitle"),
      desc: t("pillars.analyzerDesc"),
      icon: Sparkles,
      href: "/limbah-analyzer",
      badge: "Vision AI",
      color: "from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30",
      accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    },
    {
      title: t("pillars.marketplaceTitle"),
      desc: t("pillars.marketplaceDesc"),
      icon: Store,
      href: "/marketplace",
      badge: "Sirkular B2B/B2C",
      color: "from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/30",
      accent: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    },
    {
      title: t("pillars.loopiTitle"),
      desc: t("pillars.loopiDesc"),
      icon: Bot,
      href: "/loopi",
      badge: "AI Agronomy",
      color: "from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/30",
      accent: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
    },
    {
      title: t("pillars.jejakTitle"),
      desc: t("pillars.jejakDesc"),
      icon: Calculator,
      href: "/fertilizer-calculator",
      badge: "Presisi & Karbon",
      color: "from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30",
      accent: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
  ];

  const values = [
    {
      title: t("values.v1Title"),
      desc: t("values.v1Desc"),
      icon: Zap,
    },
    {
      title: t("values.v2Title"),
      desc: t("values.v2Desc"),
      icon: ShieldCheck,
    },
    {
      title: t("values.v3Title"),
      desc: t("values.v3Desc"),
      icon: TrendingUp,
    },
    {
      title: t("values.v4Title"),
      desc: t("values.v4Desc"),
      icon: Users,
    },
  ];

  const timeline = [
    {
      year: t("timeline.t1Year"),
      title: t("timeline.t1Title"),
      desc: t("timeline.t1Desc"),
    },
    {
      year: t("timeline.t2Year"),
      title: t("timeline.t2Title"),
      desc: t("timeline.t2Desc"),
    },
    {
      year: t("timeline.t3Year"),
      title: t("timeline.t3Title"),
      desc: t("timeline.t3Desc"),
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden pt-12 pb-24">
      {/* Background Decorative Gradients & Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-primary/10 blur-3xl" />
        <div className="absolute top-[800px] -right-40 -z-10 h-[450px] w-[500px] rounded-full bg-gradient-to-bl from-blue-500/10 via-emerald-500/10 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
        {/* HERO SECTION */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative text-center pt-8 sm:pt-16 pb-6"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary shadow-2xs mb-6">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{t("badge")}</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15]"
          >
            {t("heroTitle")}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {t("heroSubtitle")}
          </motion.p>

          {/* Key Metrics Grid */}
          <motion.div
            variants={itemVariants}
            className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  className="relative group rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-sm hover:border-primary/40 transition-all text-center flex flex-col items-center justify-center gap-2"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br border ${stat.color} mb-1 group-hover:scale-110 transition-transform`}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* VISION & MISSION SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-emerald-500/5 p-8 sm:p-10 shadow-md backdrop-blur-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {t("visionMission.visionTitle")}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {t("visionMission.visionDesc")}
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Globe className="h-4 w-4" />
              <span>Zero-Waste Agricultural Ecosystem</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-card to-teal-500/5 p-8 sm:p-10 shadow-md backdrop-blur-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {t("visionMission.missionTitle")}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {t("visionMission.missionDesc")}
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Building2 className="h-4 w-4" />
              <span>Petani Berdaya & Industri Hijau</span>
            </div>
          </motion.div>
        </section>

        {/* ECOSYSTEM PILLARS */}
        <section className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge className="bg-primary/10 text-primary border border-primary/20 font-semibold px-3 py-1">
              Platform Modules
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t("pillars.title")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t("pillars.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`group relative rounded-3xl border ${pillar.color} bg-gradient-to-br p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${pillar.accent}`}>
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border border-current/20 ${pillar.accent}`}>
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border/40">
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all"
                    >
                      <span>Jelajahi Fitur</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="rounded-3xl border border-border/60 bg-card p-8 sm:p-12 shadow-sm space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t("values.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div key={idx} className="space-y-3 p-4 rounded-2xl bg-muted/20 border border-border/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-foreground">
                    {val.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* TIMELINE / JOURNEY */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t("timeline.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-3xl font-black text-primary/40">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Tahap Terencana</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-primary via-emerald-700 to-teal-800 p-8 sm:p-14 text-primary-foreground text-center shadow-xl">
          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-3.5 py-1 text-xs font-semibold">
              Ekosistem Terpadu
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {t("cta.title")}
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl mx-auto">
              {t("cta.subtitle")}
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-13 px-8 rounded-2xl bg-white text-primary hover:bg-emerald-50 font-bold text-base shadow-lg transition-transform hover:scale-105"
              >
                <Link href="/limbah-analyzer">
                  <span>{t("cta.primaryBtn")}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 px-8 rounded-2xl border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white font-bold text-base backdrop-blur-sm"
              >
                <Link href="/marketplace">
                  <span>{t("cta.secondaryBtn")}</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
