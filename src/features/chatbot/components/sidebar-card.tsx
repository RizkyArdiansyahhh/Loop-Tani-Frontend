import type { ReactNode } from "react";

interface SidebarCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const SidebarCard = ({ title, children, className }: SidebarCardProps) => {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-4 shadow-sm ${className ?? ""}`}
    >
      {title && (
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default SidebarCard;
