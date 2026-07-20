import { Sprout, Wheat, Tractor, Recycle } from "lucide-react";
import Image from "next/image";

const suggestions = [
  { icon: Wheat, label: "Harga limbah pertanian" },
  { icon: Sprout, label: "Tips kompos" },
  { icon: Tractor, label: "Alat pertanian" },
  { icon: Recycle, label: "Circular economy" },
];

interface LoopiEmptyProps {
  onSelectSuggestion: (text: string) => void;
}

const LoopiEmpty = ({ onSelectSuggestion }: LoopiEmptyProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative mb-2 flex h-32 w-32 items-center justify-center">
          {/* Glowing background halo */}
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10 blur-xl" />
          <Image
            src="/images/maskot.svg"
            alt="Loopi Mascot"
            width={120}
            height={120}
            className="relative transform transition-transform duration-500 hover:scale-105"
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Halo, saya Loopi &#x1F44B;
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Saya siap membantu kebutuhan pertanian Anda. Tanyakan seputar limbah
          pertanian, produk olahan, alat farming, atau ekonomi sirkular.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              onClick={() => onSelectSuggestion(s.label)}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground/80 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-sm cursor-pointer"
            >
              <Icon className="h-4 w-4 text-primary" />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LoopiEmpty;
