import { createContext, useContext, useState, type ReactNode } from "react";
import React from "react";
import type { ChatMessageType } from "../domain/ChatMessage.types";

interface ChatContextType {
  messages: ChatMessageType[];
  addMessage: (msg: ChatMessageType) => void;
  resetMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);

  const resetMessages = () => {
    setMessages([]);
  };

  const addMessage = (msg: ChatMessageType) => {
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, resetMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatverlauf = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
