"use client";

import { Paperclip, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatInput = () => {
  return (
    <div className="sticky bottom-0 border-t border-border bg-background/80 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-primary"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tanyakan sesuatu kepada Loopi..."
            className="h-12 w-full rounded-2xl border border-border bg-muted/50 px-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-primary"
        >
          <Mic className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          className="shrink-0 rounded-2xl bg-primary text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
