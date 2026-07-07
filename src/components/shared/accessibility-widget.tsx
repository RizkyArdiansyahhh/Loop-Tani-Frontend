"use client";

import { useEffect, useState, useRef } from "react";
import { Accessibility, Type, Eye, Check, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type TextZoom = "sm" | "md" | "lg";

interface AccessibilitySettings {
  zoom: TextZoom;
  contrast: boolean;
  dyslexic: boolean;
  grayscale: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  zoom: "md",
  contrast: false,
  dyslexic: false,
  grayscale: false,
};

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load settings from localStorage and apply them to HTML root on mount
  useEffect(() => {
    const stored = localStorage.getItem("looptani_a11y");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AccessibilitySettings;
        setSettings(parsed);
        applySettings(parsed);
      } catch (e) {
        console.error("Failed to parse a11y settings", e);
      }
    }

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update localStorage and classes on change
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("looptani_a11y", JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  // Reset to default
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem("looptani_a11y", JSON.stringify(DEFAULT_SETTINGS));
    applySettings(DEFAULT_SETTINGS);
  };

  // Direct DOM updates for zero React re-render overhead of parent elements
  const applySettings = (cfg: AccessibilitySettings) => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;

    // 1. Text Zoom classes
    html.classList.remove("zoom-sm", "zoom-md", "zoom-lg");
    html.classList.add(`zoom-${cfg.zoom}`);

    // 2. High Contrast
    if (cfg.contrast) {
      html.classList.add("contrast-high");
    } else {
      html.classList.remove("contrast-high");
    }

    // 3. Dyslexic Font
    if (cfg.dyslexic) {
      html.classList.add("font-dyslexic");
    } else {
      html.classList.remove("font-dyslexic");
    }

    // 4. Grayscale Filter
    if (cfg.grayscale) {
      html.classList.add("grayscale-filter");
    } else {
      html.classList.remove("grayscale-filter");
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-250 flex flex-col items-start font-sans" ref={menuRef}>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-primary/30",
          isOpen ? "bg-gray-900 hover:bg-gray-800" : "bg-primary"
        )}
        aria-label="Fitur Aksesibilitas"
        title="Pengaturan Aksesibilitas"
      >
        {isOpen ? <X className="h-5.5 w-5.5" /> : <Accessibility className="h-5.5 w-5.5" />}
      </button>

      {/* Popover Settings Panel */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 rounded-3xl border border-gray-150 bg-white/95 p-5 shadow-2xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Accessibility className="h-4.5 w-4.5 text-primary" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">Aksesibilitas</span>
            </div>
            <button
              onClick={resetSettings}
              className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
              title="Reset ke Bawaan"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          <div className="space-y-4">
            {/* 1. Zoom Text */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5" /> Ukuran Teks
              </label>
              <div className="grid grid-cols-3 gap-1 bg-gray-50 dark:bg-gray-800/50 p-0.5 rounded-xl border border-gray-100 dark:border-gray-800">
                {(["sm", "md", "lg"] as TextZoom[]).map((z) => (
                  <button
                    key={z}
                    onClick={() => updateSetting("zoom", z)}
                    className={cn(
                      "py-1.5 text-xs font-semibold rounded-lg capitalize transition-all",
                      settings.zoom === z
                        ? "bg-white text-primary shadow-xs dark:bg-gray-800 dark:text-white"
                        : "text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    )}
                  >
                    {z === "sm" ? "A-" : z === "md" ? "A" : "A+"}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. High Contrast */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" /> Kontras Tinggi
              </span>
              <button
                onClick={() => updateSetting("contrast", !settings.contrast)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
                  settings.contrast ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5",
                    settings.contrast ? "translate-x-4.5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>

            {/* 3. Dyslexia-friendly Font */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5" /> Ramah Disleksia
              </span>
              <button
                onClick={() => updateSetting("dyslexic", !settings.dyslexic)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
                  settings.dyslexic ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5",
                    settings.dyslexic ? "translate-x-4.5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>

            {/* 4. Grayscale Filter */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" /> Buta Warna (Grayscale)
              </span>
              <button
                onClick={() => updateSetting("grayscale", !settings.grayscale)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
                  settings.grayscale ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5",
                    settings.grayscale ? "translate-x-4.5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
