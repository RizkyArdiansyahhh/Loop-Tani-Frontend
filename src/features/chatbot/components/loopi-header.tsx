"use client";

import LoopiAvatar from "./loopi-avatar";

interface LoopiHeaderProps {
  onNewChat?: () => void;
  isLoggedIn?: boolean;
}

const LoopiHeader = ({ onNewChat, isLoggedIn }: LoopiHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4 font-sans">
      <div className="flex items-center gap-3">
        <LoopiAvatar size="sm" />
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-poppins">
              Loopi AI Assistant
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
              Beta
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            Asisten AI pintar untuk pertanian, limbah, dan marketplace.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoopiHeader;
