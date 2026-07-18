import { useEffect, useRef } from "react";
import ChatBubble from "./chat-bubble";
import TypingIndicator from "./typing-indicator";

interface LoopiMessageAreaProps {
  query: string | null;
  response: string | null;
  isPending: boolean;
  isError: boolean;
}

const LoopiMessageArea = ({
  query,
  response,
  isPending,
  isError,
}: LoopiMessageAreaProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [query, response, isPending, isError]);

  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {query && (
          <ChatBubble role="user" content={query} timestamp={timestamp} />
        )}

        {isPending && <TypingIndicator />}

        {!isPending && response && (
          <ChatBubble role="bot" content={response} timestamp={timestamp} />
        )}

        {!isPending && isError && (
          <ChatBubble
            role="bot"
            content="Gagal memproses pesan chatbot. Silakan coba kembali."
            timestamp={timestamp}
          />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default LoopiMessageArea;
