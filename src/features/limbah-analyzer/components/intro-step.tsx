"use client";

import {
  Camera,
  Image as ImageIcon,
  Cpu,
  BadgeDollarSign,
  ArrowRight,
  Leaf,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface IntroStepProps {
  onStart: () => void;
}

const requirements = [
  {
    icon: Camera,
    title: "Foto jelas",
    description: "Pastikan foto terlihat jelas dengan pencahayaan cukup",
  },
  {
    icon: Leaf,
    title: "Objek limbah",
    description:
      "Foto limbah pertanian: jerami, sekam, TKKS, kotoran ternak, dll",
  },
  {
    icon: ShieldCheck,
    title: "Format didukung",
    description: "JPG, PNG, atau WEBP dengan ukuran maksimal 10MB",
  },
];

const benefits = [
  { icon: Cpu, text: "Deteksi jenis limbah otomatis" },
  { icon: BadgeDollarSign, text: "Estimasi harga jual real-time" },
  { icon: Zap, text: "Saran olahan untuk nilai tambah" },
];

const IntroStep = ({ onStart }: IntroStepProps) => {
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
          <Cpu className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Limbah Analyzer
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground max-w-sm mx-auto">
          Upload foto limbah pertanian Anda, dan AI kami akan menganalisa jenis
          limbah serta estimasi harga jualnya secara instan.
        </p>
      </div>

      {/* Requirements */}
      <div className="w-full space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
          Persiapan Foto
        </p>
        <div className="grid gap-3">
          {requirements.map((req, i) => {
            const Icon = req.icon;
            return (
              <Card key={i}>
                <CardContent className="flex items-center gap-4 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {req.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {req.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="w-full rounded-2xl border border-primary/15 bg-primary/5 p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary px-1">
          Yang Anda Dapatkan
        </p>
        <div className="space-y-2">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-sm text-foreground">{b.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <Button
        className="w-full h-12 rounded-xl text-base font-semibold"
        onClick={onStart}
      >
        Mulai Analisa
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default IntroStep;
