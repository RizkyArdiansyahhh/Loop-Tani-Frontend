import { useState, useEffect, useRef } from "react";
import LoopiAvatar from "./loopi-avatar";
import ChatFormattedText from "./chat-formatted-text";

interface ChatBubbleProps {
  role: "user" | "bot";
  content: string;
  timestamp?: string;
  isLatest?: boolean;
}

const ChatBubble = ({ role, content, timestamp, isLatest = false }: ChatBubbleProps) => {
  const isBot = role === "bot";
  const [displayedText, setDisplayedText] = useState(isBot && isLatest ? "" : content);
  const [isTyping, setIsTyping] = useState(isBot && isLatest);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isBot || !isLatest) {
      setDisplayedText(content);
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    setIsTyping(true);
    setDisplayedText("");

    const step = () => {
      // Type 2-4 characters per frame for smooth & fast ChatGPT typing speed
      currentIndex = Math.min(currentIndex + 3, content.length);
      setDisplayedText(content.slice(0, currentIndex));

      if (currentIndex < content.length) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setIsTyping(false);
      }
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [content, isBot, isLatest]);

  return (
    <div className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && <LoopiAvatar size="sm" showOnline={false} />}
      <div
        className={`flex max-w-[85%] sm:max-w-[75%] flex-col ${
          isBot ? "items-start" : "items-end"
        }`}
      >
        <div
          className={
            isBot
              ? "rounded-2xl rounded-tl-md bg-muted/65 border border-border/40 px-4 py-3 text-foreground shadow-2xs relative"
              : "rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-primary-foreground shadow-2xs"
          }
        >
          {isBot ? (
            <div className="relative">
              <ChatFormattedText text={displayedText} />
              {isTyping && (
                <span className="inline-block ml-1 font-bold text-primary animate-pulse">
                  ▍
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{content}</p>
          )}
        </div>
        {timestamp && (
          <span className="mt-1 px-1 text-[11px] text-muted-foreground">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
