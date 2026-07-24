import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import { ShoppingBag, MessageSquare, Leaf } from "lucide-react";

export function ScrollFeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSectionInView = useInView(containerRef, { amount: 0.2 });

  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) {
      setActiveIndex(0);
    } else if (latest < 0.66) {
      setActiveIndex(1);
    } else {
      setActiveIndex(2);
    }
  });

  const featuresData = [
    {
      badge: "Fitur LoopTani 1",
      title: "LoopMarket Sirkular",
      description:
        "Jual dan beli limbah pertanian berkualitas dengan mudah secara langsung. Cari penawaran terbaik dari produsen pupuk organik lokal atau tawarkan sisa panen padi, sekam, dan jerami Anda langsung ke pengepul industri nasional.",
    },
    {
      badge: "Fitur LoopTani 2",
      title: "AI Loopi Consultant",
      description:
        "Dilengkapi asisten virtual pintar berbasis AI. Pindai foto daun untuk mendiagnosis penyakit tanaman padi secara instan, kalkulasikan takaran dosis pupuk organik optimal, serta dapatkan rekomendasi harga pasar limbah pertanian secara real-time.",
    },
    {
      badge: "Fitur LoopTani 3",
      title: "Jejak Lestari (ESG Tracker)",
      description:
        "Catat dan verifikasi kontribusi dampak positif Anda terhadap lingkungan secara langsung. Dapatkan sertifikat ESG atas reduksi emisi karbon (CO₂) serta penyelamatan air tanah, dan kumpulkan LoopPoints reward menarik.",
    },
  ];

  // Render the device screens dynamically
  const tabletScreens = [
    // Screen 1: Marketplace items
    <div className="p-4 bg-slate-900/90 text-white h-full flex flex-col justify-between" key="tablet-market">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-[10px] font-bold text-slate-200">
          Catalog LoopTani
        </span>
        <span className="text-[8px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full font-bold">
          Live Feed
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-2">
        {[
          {
            name: "Sekam Padi Kering",
            price: "Rp 1.200 / kg",
            loc: "Sragen, Jateng",
          },
          {
            name: "Pupuk Kompos Organik",
            price: "Rp 4.500 / kg",
            loc: "Sleman, DIY",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-slate-950/90 border border-slate-800 rounded-lg p-2 space-y-1 shadow-md text-left"
          >
            <div className="h-12 bg-slate-900 rounded-md flex items-center justify-center text-[9px] text-slate-450 font-bold">
              🌾 {item.name.split(" ")[0]}
            </div>
            <h4 className="text-[9px] font-bold truncate text-slate-100">
              {item.name}
            </h4>
            <p className="text-[8px] font-black text-emerald-400 leading-none">
              {item.price}
            </p>
            <p className="text-[7px] text-slate-450 leading-none">{item.loc}</p>
          </div>
        ))}
      </div>
    </div>,
    // Screen 2: AI looper dashboard
    <div className="p-4 bg-slate-900/90 text-white h-full flex flex-col justify-between" key="tablet-ai">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-[10px] font-bold text-slate-200">
          AI Loopi Consultant
        </span>
        <div className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] text-slate-400 font-bold">Online</span>
        </div>
      </div>
      <div className="space-y-2 pt-2 text-left flex-1 flex flex-col justify-center">
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 space-y-1 shadow-md">
          <span className="text-[8px] font-bold text-emerald-400 block">
            Pindai Penyakit Daun Padi
          </span>
          <div className="flex gap-2 items-center">
            <div className="h-9 w-9 bg-slate-900 border border-slate-800 rounded-md flex items-center justify-center text-base">
              🍂
            </div>
            <div className="text-[8px] text-slate-350 leading-normal">
              <span className="font-bold text-slate-100 block">
                Blast Tanaman Padi (Deteksi AI)
              </span>
              Akurasi 94%. Rekomendasi: Semprot cairan fungisida hayati
              Trichoderma.
            </div>
          </div>
        </div>
      </div>
    </div>,
    // Screen 3: ESG carbon progress report
    <div className="p-4 bg-slate-900/90 text-white h-full flex flex-col justify-between text-left" key="tablet-esg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-[10px] font-bold text-slate-200">
          Jejak Lestari Dashboard
        </span>
        <span className="text-[8px] text-sky-400 font-bold">
          ESG Certificate
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2 space-y-0.5 shadow-md">
          <span className="text-[7.5px] text-slate-450 uppercase tracking-wider block font-bold">
            CO₂ Dicegah
          </span>
          <span className="text-xs font-black text-emerald-400">15.420 Kg</span>
          <p className="text-[6.5px] text-slate-400">Setara 5,9k pohon</p>
        </div>
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2 space-y-0.5 shadow-md">
          <span className="text-[7.5px] text-slate-450 uppercase tracking-wider block font-bold">
            Air Disimpan
          </span>
          <span className="text-xs font-black text-sky-400">84.200 L</span>
          <p className="text-[6.5px] text-slate-400">Bebas nitrat kimia</p>
        </div>
      </div>
      <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2 text-[8px] leading-relaxed text-slate-300 flex items-center gap-2">
        <span className="text-sm select-none">🏆</span>
        <div>
          <span className="font-bold text-slate-100 block">
            Sertifikat Dampak ESG
          </span>
          Reduksi emisi karbon terverifikasi secara sirkular.
        </div>
      </div>
    </div>,
  ];

  const phoneScreens = [
    // Phone Screen 1: Item Detail
    <div className="p-2.5 bg-slate-950 text-white h-full flex flex-col justify-between text-left" key="phone-market">
      <div className="space-y-1.5">
        <div className="h-20 bg-slate-900 rounded-lg flex items-center justify-center text-xl border border-slate-850">
          🌾
        </div>
        <span className="text-[7px] font-bold text-emerald-450 bg-emerald-950 px-1.5 py-0.5 rounded-full inline-block">
          Limbah Padi
        </span>
        <h4 className="text-[9px] font-bold leading-tight truncate">
          Sekam Padi Kering
        </h4>
        <p className="text-[9px] font-black text-emerald-400">Rp 1.200 / kg</p>
      </div>
      <button className="w-full bg-primary hover:bg-emerald-700 text-white font-bold text-[8px] py-1 rounded-md shadow-md cursor-pointer transition-colors duration-300">
        Hubungi Penjual
      </button>
    </div>,
    // Phone Screen 2: AI Loopi Chat
    <div className="p-2.5 bg-slate-950 text-white h-full flex flex-col justify-between text-left" key="phone-ai">
      <div className="space-y-1.5">
        <div className="flex gap-1 items-start">
          <div className="h-4.5 w-4.5 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center font-bold text-[8px] shrink-0">
            👤
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg rounded-tl-none p-1 text-[7px] leading-normal text-slate-350">
            Mengolah jerami sisa panen?
          </div>
        </div>
        <div className="flex gap-1 items-start">
          <div className="h-4.5 w-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[8px] shrink-0 select-none">
            🤖
          </div>
          <div className="bg-emerald-950/40 border border-emerald-900/30 rounded-lg rounded-tl-none p-1.5 text-[7px] leading-normal text-emerald-350 space-y-0.5">
            <span className="font-bold text-emerald-450 block">
              Loopi Asisten:
            </span>
            Bisa difermentasikan jadi kompos organik atau briket jerami bernilai
            jual!
          </div>
        </div>
      </div>
      <div className="h-5.5 border border-slate-800 rounded-md bg-slate-900 flex items-center px-1.5 text-[7.5px] text-slate-450 justify-between select-none">
        Kirim ke Loopi...
        <span className="font-bold text-primary">Kirim</span>
      </div>
    </div>,
    // Phone Screen 3: Impact Certificate
    <div className="p-2.5 bg-slate-950 text-white h-full flex flex-col justify-between text-left items-center justify-center space-y-2" key="phone-esg">
      <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0 select-none">
        🌱
      </div>
      <div className="text-center space-y-0.5">
        <h4 className="text-[9px] font-black text-slate-100">
          Mitra Hijau LoopTani
        </h4>
        <p className="text-[7px] text-slate-400 leading-normal">
          Diberikan atas kontribusi reduksi emisi karbon berkelanjutan.
        </p>
      </div>
      <div className="w-full bg-slate-900 border border-slate-800 rounded-md py-1.5 text-center text-[7px] text-emerald-450 font-bold uppercase tracking-wider">
        Verified ESG Record
      </div>
    </div>,
  ];

  return (
    <div
      ref={containerRef}
      className="relative h-[300vh] w-full border-t border-b border-gray-150 dark:border-gray-850"
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-[#fcfdfa] dark:bg-gray-950 transition-colors duration-1000">
        {/* Radial Reveal Circular Ripple Background Layer */}
        <motion.div
          animate={{
            clipPath: isSectionInView
              ? "circle(125% at 50% 50%)"
              : "circle(0% at 50% 50%)",
          }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          {/* Base backing color to cover transitions */}
          <div className="absolute inset-0 bg-slate-900" />

          <AnimatePresence initial={false}>
            <motion.div
              key={activeIndex}
              initial={{ clipPath: "circle(0% at 50% 50%)" }}
              animate={{ clipPath: "circle(125% at 50% 50%)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
              className={cn(
                "absolute inset-0 transition-colors duration-500",
                activeIndex === 0
                  ? "bg-emerald-950" // Deep Forest Green (Primary)
                  : activeIndex === 1
                    ? "bg-teal-950" // Deep Pine Teal (AI Loopi)
                    : "bg-slate-900", // Deep Slate (ESG/Clean Water)
              )}
            />
          </AnimatePresence>
        </motion.div>

        {/* Absolute Top Header Section */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 text-center w-full max-w-2xl px-4 z-30 select-none">
          <h2 className="font-fraunces text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2.5 leading-tight">
            Fitur Menarik LoopTani
          </h2>
          <p className="text-xs text-gray-350 mt-2 font-sans max-w-md mx-auto leading-relaxed">
            Kelola limbah pertanian secara sirkular, tingkatkan pemasukan, dan
            pelihara ekosistem hijau dalam satu platform terintegrasi.
          </p>
        </div>

        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 items-center pt-20">
          {/* Left Column: Devices & Circular Timeline (7 cols) */}
          <div className="hidden lg:block lg:col-span-7 h-full min-h-[600px] select-none relative">
            <div className="w-full h-full flex items-center justify-center min-h-[600px] relative">
              {/* Unified 600x600 box for exact alignment of SVG, devices, and nodes */}
              <div className="relative w-[600px] h-[600px] flex items-center justify-center shrink-0">
                {/* SVG Dotted Concentric Circles */}
                <svg
                  className={cn(
                    "absolute inset-0 w-full h-full pointer-events-none transition-colors duration-1000",
                    isSectionInView
                      ? "text-emerald-500/20"
                      : "text-gray-200 dark:text-gray-800",
                  )}
                  viewBox="0 0 600 600"
                >
                  {/* Two Concentric Circles (Enlarged) */}
                  <circle
                    cx="160"
                    cy="300"
                    r="200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />
                  <circle
                    cx="160"
                    cy="300"
                    r="280"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />

                  {/* Glowing active progress arc connecting the nodes on the outer line (r=280) */}
                  <path
                    d="M 389 140 A 280 280 0 0 1 389 460"
                    fill="none"
                    stroke="url(#glow-gradient-pinned)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-40"
                  />

                  <defs>
                    <linearGradient
                      id="glow-gradient-pinned"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Circular Timeline Nodes - Sitting on Outer Circle (r=280) */}
                {[
                  {
                    idx: 0,
                    x: 389,
                    y: 140,
                    icon: ShoppingBag,
                    label: "Market",
                  },
                  {
                    idx: 1,
                    x: 440,
                    y: 300,
                    icon: MessageSquare,
                    label: "Loopi",
                  },
                  { idx: 2, x: 389, y: 460, icon: Leaf, label: "ESG" },
                ].map((node) => {
                  const active = activeIndex === node.idx;
                  const Icon = node.icon;
                  return (
                    <div
                      key={node.idx}
                      style={{
                        position: "absolute",
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                      className="z-20 relative"
                    >
                      {/* Subtle breathing glow effect for Active Node */}
                      {active && (
                        <motion.div
                          className="absolute -inset-2 rounded-full bg-primary/25 blur-xs pointer-events-none"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                      <motion.div
                        animate={{
                          scale: active ? 1.08 : 1,
                          backgroundColor: active
                            ? "var(--primary)"
                            : "#022c22",
                          borderColor: active
                            ? "#ffffff"
                            : "#064e3b",
                        }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "h-14 w-14 rounded-full border-2 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 text-white",
                          active
                            ? "shadow-primary/40"
                            : "opacity-55 hover:opacity-100",
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>
                    </div>
                  );
                })}

                {/* Device Mockups */}
                <div className="absolute left-[0px] top-[185px] w-[360px] h-[230px]">
                  {/* Image of Farmer (Background under devices) */}
                  <div className="absolute inset-0 bg-[url('/images/auth-carousel-1.jpg')] bg-cover bg-center rounded-2xl opacity-10 filter contrast-125 border border-emerald-500/10" />

                  {/* Tablet Container */}
                  <div className="absolute left-0 top-0 w-[320px] h-[215px] bg-slate-950 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden z-10 flex flex-col justify-between">
                    <div className="flex-1 overflow-hidden relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.25 }}
                          className="absolute inset-0"
                        >
                          {tabletScreens[activeIndex]}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Mobile Phone Mockup */}
                  <div className="absolute left-[240px] top-[95px] w-[120px] h-[230px] bg-slate-950 rounded-[24px] border-4 border-slate-800 shadow-2xl overflow-hidden z-20 flex flex-col justify-between">
                    <div className="w-12 h-3 bg-slate-850 rounded-full mx-auto my-1 shrink-0 border border-slate-800" />
                    <div className="flex-1 overflow-hidden relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className="absolute inset-0"
                        >
                          {phoneScreens[activeIndex]}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Text Slider (5 cols) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center px-8 md:px-16 lg:px-20 min-h-[350px] relative z-10 text-left select-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-4 max-w-lg"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  {featuresData[activeIndex].badge}
                </span>
                <h3 className="font-fraunces text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {featuresData[activeIndex].title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {featuresData[activeIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
