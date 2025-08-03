import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import React from 'react';
import type { ChatMessageType } from '../domain/ChatMessage.ts';
import useOpeningMessage from './useOpeningMessage.ts';

interface ChatContextType {
  messages: ChatMessageType[];
  addMessage: (msg: ChatMessageType) => void;
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
  const [messages, setMessages] = useState<ChatMessageType[]>([opening]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const resetMessages = () => {
    sessionStorage.removeItem(STORAGE_KEY);
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
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
