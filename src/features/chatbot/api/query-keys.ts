export const chatbotKeys = {
  all: ["chatbot"] as const,
  conversations: () => [...chatbotKeys.all, "conversations"] as const,
  detail: (id: string | null) => [...chatbotKeys.all, "detail", id] as const,
};
