import { type LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RevenueStatCardProps {
  title: string;
  amount: number;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  actionLabel?: string;
  onAction?: () => void;
  isPrimary?: boolean;
}

export function RevenueStatCard({
  title,
  amount,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-primary/10",
  iconTextColor = "text-primary",
  actionLabel,
  onAction,
  isPrimary = false,
}: RevenueStatCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 space-y-4 shadow-xs transition-all font-sans ${
        isPrimary
          ? "bg-primary text-primary-foreground border-primary/20"
          : "bg-card border-border/70 text-card-foreground"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`text-xs font-bold font-poppins ${isPrimary ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
          {title}
        </span>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
            isPrimary ? "bg-white/20 text-white" : `${iconBgColor} ${iconTextColor}`
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className={`text-2xl font-bold font-mono tracking-tight ${isPrimary ? "text-white" : "text-foreground"}`}>
          {formatCurrency(amount)}
        </h3>
        <p className={`text-[11px] ${isPrimary ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-1">
          <Button
            size="sm"
            onClick={onAction}
            className={`w-full h-9 rounded-xl text-xs font-bold cursor-pointer font-poppins shadow-xs ${
              isPrimary
                ? "bg-white text-primary hover:bg-white/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
