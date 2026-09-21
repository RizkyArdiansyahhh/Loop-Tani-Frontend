"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  role: string;
  src: string;
  width: number;
  height: number;
  zIndex: number;
  marginClass?: string;
  glowPosition: string;
}

const MEMBERS: Member[] = [
  {
    id: "dosen",
    name: "Dosen Pembimbing",
    role: "Advisor & Penasihat Riset",
    src: "/images/about/team-1-dosen-crop.webp",
    width: 660,
    height: 850,
    zIndex: 10,
    glowPosition: "ellipse at 18% 60%",
  },
  {
    id: "rizky",
    name: "Rizky Ardiansyah",
    role: "COO (Chief Operating Officer)",
    src: "/images/about/team-2-rizky-crop.webp",
    width: 590,
    height: 790,
    zIndex: 20,
    marginClass: "ml-[-7vw] sm:ml-[-6vw] md:ml-[-6.5vw]",
    glowPosition: "ellipse at 38% 60%",
  },
  {
    id: "ahmad",
    name: "Ahmad Kurniawan",
    role: "CMO (Chief Marketing Officer)",
    src: "/images/about/team-3-ahmad-crop.webp",
    width: 579,
    height: 785,
    zIndex: 30,
    marginClass: "ml-[-7vw] sm:ml-[-6vw] md:ml-[-6.8vw]",
    glowPosition: "ellipse at 63% 60%",
  },
  {
    id: "abel",
    name: "Abel Vigrajuska Asri",
    role: "CEO (Chief Executive Officer)",
    src: "/images/about/team-4-ebel-crop.webp",
    width: 579,
    height: 840,
    zIndex: 40,
    marginClass: "ml-[-7vw] sm:ml-[-6vw] md:ml-[-8.2vw]",
    glowPosition: "ellipse at 84% 60%",
  },
];

export default function TukuCommunitySection() {
  const t = useTranslations("about.team");
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const activeMember = React.useMemo(
    () => MEMBERS.find((m) => m.id === hoveredId),
    [hoveredId]
  );

  return (
    <div className="relative w-full h-full flex-1 flex flex-col justify-between overflow-hidden bg-background text-foreground select-none">
      {/* Top Header Row (Outside colored section, on clean bg-background) */}
      <div className="relative z-20 w-full px-5 sm:px-8 md:px-10 lg:px-12 pt-3 sm:pt-4 md:pt-5 pb-2 sm:pb-3 pointer-events-none shrink-0 bg-background">
        <h1 className="font-fraunces font-black uppercase text-2xl sm:text-3xl md:text-5xl lg:text-[46px] xl:text-[54px] tracking-tight text-[#1E1914] dark:text-[#EDE8DF] leading-[1.05] text-left">
          <span>{t("headlinePart1")}</span>
          <br />
          <span>{t("headlinePart2")}</span>
        </h1>
      </div>

      {/* Colored Section - Only for the team members lineup */}
      <section className="relative z-10 w-full flex-1 min-h-0 flex items-end justify-center overflow-hidden bg-[#F5BE38] dark:bg-[#2A2210] transition-colors duration-500">
        {/* Dynamic Primary & Secondary Background Transition on Hover */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out z-0",
            hoveredId ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Primary Agricultural Green Base Gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-primary via-[#163f22] to-[#0c2414]" />

          {/* Secondary Lime Ambient Spotlight directly behind the hovered member */}
          {activeMember && (
            <div
              className="absolute inset-0 transition-all duration-700 ease-out opacity-40 mix-blend-screen"
              style={{
                background: `radial-gradient(${activeMember.glowPosition}, var(--secondary) 0%, transparent 65%)`,
              }}
            />
          )}

          {/* Soft secondary bottom glow strip */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-secondary/20 via-secondary/5 to-transparent pointer-events-none" />
        </div>

        {/* 4 Team Members Lineup */}
        <div className="relative z-10 flex items-end justify-center max-w-none w-full min-w-full h-full">
          {MEMBERS.map((member) => {
            const isHovered = hoveredId === member.id;

            return (
              <div
                key={member.id}
                style={{ zIndex: isHovered ? 50 : member.zIndex }}
                onMouseEnter={() => setHoveredId(member.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() =>
                  setHoveredId((prev) => (prev === member.id ? null : member.id))
                }
                className={cn(
                  "relative flex items-end justify-center shrink-0 h-full cursor-pointer transition-all duration-300 group",
                  member.marginClass,
                  hoveredId && !isHovered && "opacity-80 brightness-90"
                )}
              >
                <Image
                  src={member.src}
                  alt={member.name}
                  width={member.width}
                  height={member.height}
                  priority
                  draggable={false}
                  className={cn(
                    "h-full max-h-[75vh] w-auto max-w-none object-bottom block pointer-events-none select-none transition-transform duration-300 origin-bottom",
                    isHovered ? "scale-105" : "scale-100"
                  )}
                  style={{
                    filter: isHovered
                      ? "drop-shadow(3.5px 0 0 #ffffff) drop-shadow(-3.5px 0 0 #ffffff) drop-shadow(0 3.5px 0 #ffffff) drop-shadow(0 -3.5px 0 #ffffff) drop-shadow(0 0 14px var(--secondary)) drop-shadow(0 20px 28px rgba(0,0,0,0.38))"
                      : "drop-shadow(3.5px 0 0 #ffffff) drop-shadow(-3.5px 0 0 #ffffff) drop-shadow(0 3.5px 0 #ffffff) drop-shadow(0 -3.5px 0 #ffffff) drop-shadow(0 0 2px #ffffff) drop-shadow(0 14px 20px rgba(0,0,0,0.22))",
                  }}
                />

                {/* Floating Name Badge - Positioned in the Bottom Center of Photo */}
                <div
                  className={cn(
                    "absolute bottom-5 sm:bottom-7 md:bottom-9 lg:bottom-11 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 ease-out flex flex-col items-center whitespace-nowrap",
                    isHovered
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-3 scale-95"
                  )}
                >
                  <div className="flex flex-col items-center gap-1 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-primary/95 text-white border-2 border-secondary shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-md">
                    <span className="font-bold text-xs sm:text-sm md:text-base tracking-tight text-white drop-shadow-xs">
                      {t.has(`members.${member.id}.name`)
                        ? t(`members.${member.id}.name`)
                        : member.name}
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground shadow-xs">
                      {t.has(`members.${member.id}.role`)
                        ? t(`members.${member.id}.role`)
                        : member.role}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
