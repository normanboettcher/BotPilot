import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import React from 'react';
import type { ChatMessageButton, ChatMessageText } from '../domain/ChatMessageText.ts';
import useOpeningMessage from './useOpeningMessage.ts';

interface ChatContextType {
  messages: (ChatMessageText | ChatMessageButton)[];
  addMessage: (msg: ChatMessageText | ChatMessageButton) => void;
  resetMessages: () => void;
}

const STORAGE_KEY = 'chatbot-messages';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  // @ts-ignore
  const getMessagesFromCache = () => {
    return localStorage.getItem(STORAGE_KEY);
  };
  const { opening } = useOpeningMessage();
  const [messages, setMessages] = useState<(ChatMessageText | ChatMessageButton)[]>([
    opening,
  ]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const resetMessages = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setMessages([]);
  };

  const addMessage = (msg: ChatMessageText | ChatMessageButton) => {
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
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
