import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatBubble from "./chat-bubble";
import TypingIndicator from "./typing-indicator";
import type { ChatMessageItem } from "../api/send-message";

interface LoopiMessageAreaProps {
  messages: ChatMessageItem[];
  isPending: boolean;
  errorMessage?: string | null;
}

const LoopiMessageArea = ({
  messages,
  isPending,
  errorMessage,
}: LoopiMessageAreaProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending, errorMessage]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {messages.map((msg, index) => {
          const timestamp = msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

          return (
            <motion.div
              key={msg.id || index}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ChatBubble
                role={msg.role === "user" ? "user" : "bot"}
                content={msg.content}
                timestamp={timestamp}
              />
            </motion.div>
          );
        })}

        {isPending && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <TypingIndicator />
          </motion.div>
        )}

        {errorMessage && !isPending && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatBubble
              role="bot"
              content={errorMessage}
              timestamp={new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default LoopiMessageArea;
