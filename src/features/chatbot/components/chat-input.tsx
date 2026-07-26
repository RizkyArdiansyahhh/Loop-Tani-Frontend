"use client";

import { Paperclip, Mic, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const t = useTranslations("loopi");

  const quickQuestions = [
    t("questions.q1.question"),
    t("questions.q2.question"),
    t("questions.q3.question"),
    t("questions.q4.question"),
    t("questions.q5.question"),
  ];

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
    <div className="sticky bottom-0 border-t border-border/80 bg-card/95 px-4 sm:px-6 py-3.5 backdrop-blur-xl space-y-3 font-sans">
      {/* Quick Auto Questions Pills Carousel (No icons, 100% next-intl) */}
      <div className="mx-auto max-w-3xl flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="text-[11px] font-bold text-primary shrink-0 mr-1 select-none">
          <span>{t("quickLabel")}</span>
        </div>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSend(q)}
            className="shrink-0 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-semibold text-foreground/90 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Main Input Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-center gap-2.5"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="shrink-0 text-muted-foreground hover:text-primary rounded-xl"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="relative flex-1">
          <Input
            name="message"
            type="text"
            placeholder={t("placeholder")}
            disabled={disabled}
            autoComplete="off"
            className="h-11 w-full rounded-xl border border-border bg-muted/30 px-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="shrink-0 text-muted-foreground hover:text-primary rounded-xl"
        >
          <Mic className="h-5 w-5" />
        </Button>

        <Button
          type="submit"
          size="icon"
          disabled={disabled}
          className="shrink-0 rounded-xl bg-primary text-primary-foreground shadow-xs transition-all hover:bg-primary/90 cursor-pointer h-11 w-11"
        >
          <Send className="h-4.5 w-4.5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
