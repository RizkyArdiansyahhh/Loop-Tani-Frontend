"use client";

import { useState } from "react";
import {
  Wheat,
  Sprout,
  Tractor,
  BookOpen,
  Recycle,
  MessageCircle,
} from "lucide-react";
import LoopiHeader from "./loopi-header";
import LoopiMessageArea from "./loopi-message";
import LoopiSidebar from "./loopi-sidebar";
import ChatInput from "./chat-input";
import SuggestionCard from "./suggestion-card";
import LoopiEmpty from "./loopi-empty";
import { useChatbot } from "../hooks/use-chatbot";

const suggestions = [
  {
    icon: Wheat,
    title: "Cari Limbah Pertanian",
    description: "Temukan limbah pertanian terdekat",
  },
  {
    icon: Sprout,
    title: "Produk Olahan",
    description: "Jelajahi produk olahan pertanian",
  },
  {
    icon: Tractor,
    title: "Alat Secondhand",
    description: "Peralatan farming bekas berkualitas",
  },
  {
    icon: BookOpen,
    title: "Belajar Kompos",
    description: "Panduan pembuatan kompos",
  },
  {
    icon: Recycle,
    title: "Circular Economy",
    description: "Ekonomi sirkular pertanian",
  },
  {
    icon: MessageCircle,
    title: "Tanya Marketplace",
    description: "Bantuan seputar marketplace",
  },
];

const LoopiChat = () => {
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  const { mutate, isPending, isError } = useChatbot();

  const handleSend = (message: string) => {
    setLastQuery(message);
    setLastResponse(null);
    mutate(
      { message },
      {
        onSuccess: (data) => {
          setLastResponse(data.message);
        },
      }
    );
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 p-6">
      {/* Main Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="shrink-0 border-b border-border px-6 py-5">
          <LoopiHeader />
        </div>

        {/* Suggestion Cards */}
        <div className="shrink-0 border-b border-border px-6 py-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {suggestions.map((s, i) => (
              <SuggestionCard
                key={i}
                icon={s.icon}
                title={s.title}
                description={s.description}
                onClick={() => handleSend(s.title)}
              />
            ))}
          </div>
        </div>

        {/* Messages or Empty State */}
        {lastQuery === null ? (
          <LoopiEmpty onSelectSuggestion={handleSend} />
        ) : (
          <LoopiMessageArea
            query={lastQuery}
            response={lastResponse}
            isPending={isPending}
            isError={isError}
          />
        )}

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isPending} />
      </div>

      {/* Right Sidebar */}
      <LoopiSidebar />
    </div>
  );
};

export default LoopiChat;
