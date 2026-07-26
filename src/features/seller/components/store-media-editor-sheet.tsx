"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  ZoomIn,
  ZoomOut,
  Check,
  RotateCcw,
  Sprout,
  Store,
  Leaf,
  Tractor,
  Wheat,
  Warehouse,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Convert raw SVG string to safe Base64 Data URL for cross-browser <img> & CSS support
function svgToBase64DataUrl(svgString: string): string {
  const cleanSvg = svgString.trim();
  try {
    const base64 =
      typeof window !== "undefined"
        ? window.btoa(unescape(encodeURIComponent(cleanSvg)))
        : Buffer.from(cleanSvg).toString("base64");
    return `data:image/svg+xml;base64,${base64}`;
  } catch {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleanSvg)}`;
  }
}

// Preset Icon Options for Store Logo with crisp vector paths
const PRESET_LOGOS = [
  {
    id: "sprout",
    label: "Tunas Pertanian",
    icon: Sprout,
    bgColor: "#059669",
    bgClass: "bg-emerald-600",
    path: `<path d="M7 20h10M12 20v-8M12 12A6 6 0 0 1 6 6c0 3 3 6 6 6zM12 12a6 6 0 0 0 6-6c0 3-3 6-6 6z" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  {
    id: "store",
    label: "Toko Utama",
    icon: Store,
    bgColor: "#166534",
    bgClass: "bg-green-800",
    path: `<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4M2 7h20M4 7v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  {
    id: "leaf",
    label: "Daun Organik",
    icon: Leaf,
    bgColor: "#16a34a",
    bgClass: "bg-green-600",
    path: `<path d="M11 20A60 60 0 0 0 21 3a60 60 0 0 0-17 17A20 20 0 0 0 11 20zM2 21l9-9" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  {
    id: "wheat",
    label: "Pangan & Hasil",
    icon: Wheat,
    bgColor: "#d97706",
    bgClass: "bg-amber-600",
    path: `<path d="M2 22 16 8M3.47 12.53 5 11l1.53 1.53M8.47 7.53 10 6l1.53 1.53M13.47 2.53 15 1l1.53 1.53M11 5 9.47 3.47 8 5M16 10l-1.53-1.53L13 10M21 15l-1.53-1.53L18 15M17 19.53 18.53 21l1.47-1.47M12 14.53 13.53 16l1.47-1.47M7 9.53 8.53 11 10 9.53" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  {
    id: "tractor",
    label: "Usaha Tani",
    icon: Tractor,
    bgColor: "#0d9488",
    bgClass: "bg-teal-600",
    path: `<path d="m10 11 11 .9c.6 0 1 .5 1 1.1v3c0 .6-.4 1-1 1h-2M4 17A3 3 0 1 0 4 11A3 3 0 0 0 4 17zM18 17A3 3 0 1 0 18 11A3 3 0 0 0 18 17zM7 17h8M4 11V7a2 2 0 0 1 2-2h3l2 3h4" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  {
    id: "barn",
    label: "Gudang Hasil",
    icon: Warehouse,
    bgColor: "#334155",
    bgClass: "bg-slate-700",
    path: `<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35zM6 18h12M6 14h12" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
];

// Preset SVG Banners
const PRESET_BANNERS = [
  {
    id: "emerald-harvest",
    label: "Hijau Panen",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#064e3b"/>
          <stop offset="50%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#0d9488"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="400" fill="url(#g1)"/>
      <circle cx="1000" cy="200" r="250" fill="rgba(255,255,255,0.06)"/>
      <circle cx="100" cy="100" r="180" fill="rgba(255,255,255,0.04)"/>
    </svg>`,
  },
  {
    id: "golden-wheat",
    label: "Kuning Sawah",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
      <defs>
        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#78350f"/>
          <stop offset="50%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="400" fill="url(#g2)"/>
      <circle cx="200" cy="300" r="220" fill="rgba(255,255,255,0.08)"/>
      <circle cx="1100" cy="80" r="160" fill="rgba(255,255,255,0.05)"/>
    </svg>`,
  },
  {
    id: "organic-farm",
    label: "Perkebunan Subur",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
      <defs>
        <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#14532d"/>
          <stop offset="50%" stop-color="#15803d"/>
          <stop offset="100%" stop-color="#166534"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="400" fill="url(#g3)"/>
      <circle cx="600" cy="-50" r="300" fill="rgba(255,255,255,0.07)"/>
    </svg>`,
  },
  {
    id: "eco-loop",
    label: "Sirkular Eco",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
      <defs>
        <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f766e"/>
          <stop offset="50%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="400" fill="url(#g4)"/>
      <circle cx="900" cy="300" r="280" fill="rgba(255,255,255,0.08)"/>
    </svg>`,
  },
];

interface StoreMediaEditorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "logo" | "banner";
  currentUrl: string;
  onApply: (newUrl: string) => void;
}

export function StoreMediaEditorSheet({
  open,
  onOpenChange,
  type,
  currentUrl,
  onApply,
}: StoreMediaEditorSheetProps) {
  const [draftUrl, setDraftUrl] = useState<string>(currentUrl);
  const [zoom, setZoom] = useState<number>(1);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setDraftUrl(currentUrl);
      setZoom(1);
      setSelectedPresetId(null);
    }
    onOpenChange(isOpen);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus berupa gambar");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setDraftUrl(base64);
        setSelectedPresetId(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const generateLogoPresetDataUrl = (preset: typeof PRESET_LOGOS[0]) => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="${preset.bgColor}"/>
      <circle cx="200" cy="200" r="140" fill="rgba(255,255,255,0.14)"/>
      <g transform="translate(100, 100) scale(8.33)">
        ${preset.path}
      </g>
    </svg>`;
    return svgToBase64DataUrl(svgString);
  };

  const generateBannerPresetDataUrl = (preset: typeof PRESET_BANNERS[0]) => {
    return svgToBase64DataUrl(preset.svg);
  };

  const handleSelectLogoPreset = (preset: typeof PRESET_LOGOS[0]) => {
    setSelectedPresetId(preset.id);
    const dataUrl = generateLogoPresetDataUrl(preset);
    setDraftUrl(dataUrl);
  };

  const handleSelectBannerPreset = (preset: typeof PRESET_BANNERS[0]) => {
    setSelectedPresetId(preset.id);
    const dataUrl = generateBannerPresetDataUrl(preset);
    setDraftUrl(dataUrl);
  };

  const handleConfirmSave = () => {
    onApply(draftUrl);
    toast.success(type === "logo" ? "Foto logo berhasil diperbarui" : "Banner sampul berhasil diperbarui");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-card">
        <SheetHeader className="p-6 border-b border-border/50">
          <SheetTitle className="text-base font-bold flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>{type === "logo" ? "Edit Logo Toko" : "Edit Banner Sampul"}</span>
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Sesuaikan skala zoom, pilih icon preset instan, atau unggah gambar sendiri.
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* ── LIVE INTERACTIVE PREVIEW WITH ZOOM SCALE ── */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Preview Live</span>
              <span className="text-[11px] font-mono text-muted-foreground">Scale: {zoom.toFixed(2)}x</span>
            </label>

            <div className="relative rounded-2xl border border-border/80 bg-muted/20 overflow-hidden flex items-center justify-center p-4 min-h-45">
              {type === "logo" ? (
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-white/50 shadow-md flex items-center justify-center bg-card">
                  {draftUrl ? (
                    <img
                      src={draftUrl}
                      alt="Logo Preview"
                      className="w-full h-full object-cover transition-transform duration-100 ease-out"
                      style={{ transform: `scale(${zoom})` }}
                    />
                  ) : (
                    <Store className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
              ) : (
                <div className="w-full h-32 rounded-xl overflow-hidden border border-white/40 shadow-sm relative bg-card">
                  {draftUrl ? (
                    <img
                      src={draftUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover transition-transform duration-100 ease-out"
                      style={{ transform: `scale(${zoom})` }}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-r from-emerald-800 to-teal-900 flex items-center justify-center text-white text-xs font-medium">
                      Pratinjau Banner
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-3 pt-2 px-1">
              <ZoomOut className="w-4 h-4 text-muted-foreground shrink-0" />
              <Slider
                value={[zoom]}
                min={1}
                max={2.5}
                step={0.05}
                onValueChange={(val) => setZoom(val[0])}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground shrink-0" />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setZoom(1)}
                title="Reset Zoom"
                className="rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* ── PRESET ICON SELECTION ── */}
          {type === "logo" ? (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground block">
                Pilih Icon Logo Preset Instan (1-Klik)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_LOGOS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  const logoDataUrl = generateLogoPresetDataUrl(preset);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectLogoPreset(preset)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5",
                        isSelected
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-border/60 hover:bg-muted/50"
                      )}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs border border-white/20">
                        <img src={logoDataUrl} alt={preset.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-semibold text-center text-foreground truncate w-full">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground block">
                Pilih Sampul Preset Pertanian (1-Klik)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PRESET_BANNERS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  const bannerDataUrl = generateBannerPresetDataUrl(preset);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectBannerPreset(preset)}
                      className={cn(
                        "relative rounded-xl overflow-hidden border transition-all cursor-pointer h-20 group text-left",
                        isSelected ? "border-primary ring-2 ring-primary/30" : "border-border/60 hover:opacity-90"
                      )}
                    >
                      <img src={bannerDataUrl} alt={preset.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent p-2 flex items-end">
                        <span className="text-[11px] font-bold text-white truncate">{preset.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── CUSTOM FILE UPLOAD BUTTON (MATCHING PREVIEW SIZE) ── */}
          <div className="space-y-2.5 pt-2 border-t border-border/50">
            <label className="text-xs font-semibold text-foreground block">
              Atau Unggah Gambar dari Perangkat
            </label>
            
            {type === "logo" ? (
              <div className="flex items-center gap-4 p-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="w-16 h-16 rounded-xl border border-primary/30 bg-card overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                  {draftUrl ? (
                    <img src={draftUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs font-bold text-foreground">File Logo Persegi (1:1)</p>
                  <p className="text-[10.5px] text-muted-foreground">JPG, PNG, atau WEBP (Maksimal 5MB)</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-[11px] font-bold rounded-lg cursor-pointer border-primary/30 text-primary hover:bg-primary hover:text-white"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e: any) => handleFileUpload(e);
                      input.click();
                    }}
                  >
                    <Upload className="w-3 h-3 mr-1.5" />
                    <span>Pilih Gambar Logo</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors space-y-2 text-center">
                <p className="text-xs font-bold text-foreground">File Banner Persegi Panjang (3:1)</p>
                <p className="text-[10.5px] text-muted-foreground">Rekomendasi ukuran 1200 x 400 pixel</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs font-bold rounded-xl cursor-pointer border-primary/30 text-primary hover:bg-primary hover:text-white w-full justify-center"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e: any) => handleFileUpload(e);
                    input.click();
                  }}
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  <span>Pilih Gambar Banner</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="p-4 border-t border-border/50 bg-muted/20 flex flex-row items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 rounded-xl text-xs font-semibold"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleConfirmSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 rounded-xl text-xs font-bold gap-2 cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Foto</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
