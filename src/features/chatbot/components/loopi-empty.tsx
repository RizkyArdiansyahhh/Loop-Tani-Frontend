import { Sprout, Wheat, Tractor, Recycle } from "lucide-react";
import LoopiAvatar from "./loopi-avatar";

const suggestions = [
  { icon: Wheat, label: "Harga limbah pertanian" },
  { icon: Sprout, label: "Tips kompos" },
  { icon: Tractor, label: "Alat pertanian" },
  { icon: Recycle, label: "Circular economy" },
];

const LoopiEmpty = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-secondary/30 p-6">
          <LoopiAvatar size="lg" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
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
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
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
