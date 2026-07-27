"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Wheat,
  Sprout,
  Tractor,
  BookOpen,
  Recycle,
  MessageCircle,
} from "lucide-react";

interface LoopiEmptyProps {
  onSelectSuggestion: (text: string) => void;
}

const TOPIC_SUGGESTIONS = [
  {
    icon: Wheat,
    title: "Cari Limbah Pertanian",
    description: "Temukan limbah pertanian terdekat",
    query: "Bagaimana cara mencari limbah pertanian terdekat di LoopTani?",
  },
  {
    icon: Sprout,
    title: "Produk Olahan",
    description: "Jelajahi produk olahan pertanian",
    query: "Apa saja produk olahan pertanian hasil olahan limbah di marketplace?",
  },
  {
    icon: Tractor,
    title: "Alat Secondhand",
    description: "Peralatan farming bekas berkualitas",
    query: "Bagaimana cara membeli atau menjual peralatan pertanian secondhand?",
  },
  {
    icon: BookOpen,
    title: "Belajar Kompos",
    description: "Panduan pembuatan kompos",
    query: "Bagaimana panduan langkah pembuatan pupuk kompos dari limbah?",
  },
  {
    icon: Recycle,
    title: "Circular Economy",
    description: "Ekonomi sirkular pertanian",
    query: "Apa manfaat ekonomi sirkular limbah pertanian bagi petani?",
  },
  {
    icon: MessageCircle,
    title: "Tanya Marketplace",
    description: "Bantuan seputar marketplace",
    query: "Bagaimana cara kerja transaksi dan garansi di LoopTani?",
  },
];

const LoopiEmpty = ({ onSelectSuggestion }: LoopiEmptyProps) => {
  const t = useTranslations("loopi");

  const quickQuestions = [
    {
      title: t("questions.q1.title"),
      question: t("questions.q1.question"),
    },
    {
      title: t("questions.q2.title"),
      question: t("questions.q2.question"),
    },
    {
      title: t("questions.q3.title"),
      question: t("questions.q3.question"),
    },
    {
      title: t("questions.q4.title"),
      question: t("questions.q4.question"),
    },
    {
      title: t("questions.q5.title"),
      question: t("questions.q5.question"),
    },
  ];

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 font-sans w-full max-w-5xl mx-auto my-auto overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full">
        {/* Left Column: Mascot & Greeting */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center shrink-0">
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/15 blur-2xl" />
            <Image
              src="/images/maskot.svg"
              alt="Loopi Mascot"
              width={100}
              height={100}
              className="relative transform transition-transform duration-500 hover:scale-105 drop-shadow-md"
            />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary">
              <span>Loopi AI Assistant</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-poppins">
              {t("welcomeTitle")}
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground font-medium max-w-xs">
              {t("welcomeSubtitle")}
            </p>
          </div>
        </div>

        {/* Right Column: 6 Topic Cards & 5 Quick Questions */}
        <div className="md:col-span-8 space-y-4 w-full">
          {/* Section 1: 6 Topic Cards */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-0.5">
              Topik Populer
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full">
              {TOPIC_SUGGESTIONS.map((topic, i) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={i}
                    onClick={() => onSelectSuggestion(topic.query)}
                    className="flex flex-col items-start gap-2 rounded-2xl border border-border/80 bg-card p-3 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 cursor-pointer group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shrink-0">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground font-poppins group-hover:text-primary transition-colors line-clamp-1">
                        {topic.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {topic.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: 5 Quick Questions (Tanya Cepat) */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-0.5">
              {t("quickLabel")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {quickQuestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSelectSuggestion(s.question)}
                  className="flex flex-col gap-0.5 rounded-xl border border-border/70 bg-muted/30 p-2.5 text-left transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 cursor-pointer group"
                >
                  <p className="font-bold text-foreground font-poppins text-[11px] group-hover:text-primary transition-colors">
                    {s.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                    "{s.question}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoopiEmpty;
