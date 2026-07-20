"use client";

import { Paperclip, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;
    const formData = new FormData(e.currentTarget);
    const text = formData.get("message") as string;
    if (!text || !text.trim()) return;
    onSend(text.trim());
    e.currentTarget.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 border-t border-border bg-background/80 px-6 py-4 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="shrink-0 text-muted-foreground hover:text-primary"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="relative flex-1">
          <Input
            name="message"
            type="text"
            placeholder="Tanyakan sesuatu kepada Loopi..."
            disabled={disabled}
            autoComplete="off"
            className="h-12 w-full rounded-2xl border border-border bg-muted/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-300"
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="shrink-0 text-muted-foreground hover:text-primary"
        >
          <Mic className="h-5 w-5" />
        </Button>

        <Button
          type="submit"
          size="icon"
          disabled={disabled}
          className="shrink-0 rounded-2xl bg-primary text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
