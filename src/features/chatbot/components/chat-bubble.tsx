import LoopiAvatar from "./loopi-avatar";
import ChatFormattedText from "./chat-formatted-text";

interface ChatBubbleProps {
  role: "user" | "bot";
  content: string;
  timestamp?: string;
}

const ChatBubble = ({ role, content, timestamp }: ChatBubbleProps) => {
  const isBot = role === "bot";

  return (
    <div className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && <LoopiAvatar size="sm" showOnline={false} />}
      <div
        className={`flex max-w-[75%] flex-col ${isBot ? "items-start" : "items-end"}`}
      >
        <div
          className={
            isBot
              ? "rounded-2xl rounded-tl-md bg-secondary/30 px-4 py-3 text-foreground"
              : "rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-primary-foreground"
          }
        >
          {isBot ? (
            <ChatFormattedText text={content} />
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
