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
import { useConversationDetail } from "../hooks/use-conversation-detail";
import { authClient } from "@/lib/auth-client";
import type { ChatMessageItem } from "../api/send-message";
import type { AxiosError } from "axios";

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
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessageItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: conversationDetail } = useConversationDetail(activeConversationId);
  const { mutate, isPending } = useChatbot();

  // Active messages: for authenticated existing chat, merge query data with local pending messages
  const displayMessages: ChatMessageItem[] = activeConversationId && conversationDetail
    ? conversationDetail.messages.concat(
        localMessages.filter(
          (lm) => !conversationDetail.messages.some((cm) => cm.id && cm.id === lm.id)
        )
      )
    : localMessages;

  const handleNewChat = () => {
    setActiveConversationId(null);
    setLocalMessages([]);
    setErrorMessage(null);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setLocalMessages([]);
    setErrorMessage(null);
  };

  const handleSend = (messageText: string) => {
    setErrorMessage(null);

    // Optimistically add user message
    const tempUserMsg: ChatMessageItem = {
      role: "user",
      content: messageText,
      createdAt: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, tempUserMsg]);

    mutate(
      {
        message: messageText,
        conversationId: activeConversationId,
      },
      {
        onSuccess: (data) => {
          if (data.conversationId) {
            if (!activeConversationId) {
              setActiveConversationId(data.conversationId);
            }
            if (data.userMessage && data.assistantMessage) {
              setLocalMessages((prev) => [
                ...prev.filter((m) => m.content !== messageText),
                data.userMessage!,
                data.assistantMessage!,
              ]);
            }
          } else if (data.message) {
            // Anonymous user
            const botMsg: ChatMessageItem = {
              role: "model",
              content: data.message,
              createdAt: new Date().toISOString(),
            };
            setLocalMessages((prev) => [...prev, botMsg]);
          }
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          const msg =
            err.response?.data?.message ||
            "Gagal memproses pesan chatbot. Silakan coba kembali.";
          setErrorMessage(msg);
        },
      }
    );
  };

  const hasMessages = displayMessages.length > 0;

  return (
    <div className="relative flex h-[calc(100vh-4rem)] gap-6 p-6 overflow-hidden">
      {/* Background glow effects for premium look */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      {/* Main Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-xl shadow-primary/5 backdrop-blur-md transition-all duration-300">
        {/* Header */}
        <div className="shrink-0 border-b border-border px-6 py-5">
          <LoopiHeader onNewChat={handleNewChat} isLoggedIn={isLoggedIn} />
        </div>

        {/* Suggestion Cards - Hide when chat starts */}
        {!hasMessages && (
          <div className="shrink-0 border-b border-border px-6 py-4 bg-muted/20 animate-fade-in">
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
        )}

        {/* Messages or Empty State */}
        {!hasMessages ? (
          <LoopiEmpty onSelectSuggestion={handleSend} />
        ) : (
          <LoopiMessageArea
            messages={displayMessages}
            isPending={isPending}
            errorMessage={errorMessage}
          />
        )}

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isPending} />
      </div>

      {/* Right Sidebar */}
      <LoopiSidebar
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />
    </div>
  );
};

export default LoopiChat;
