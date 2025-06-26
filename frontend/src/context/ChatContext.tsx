import { createContext, useContext, useState, type ReactNode } from "react";
import type { ChatMessage } from "../domain/ChatMessage.types.ts"
import React from "react";

interface ChatContextType {
    messages: ChatMessage[];
    addMessage: (msg: ChatMessage) => void;
    resetMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({children}: {children: ReactNode}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    
    const resetMessages = () => {
        setMessages([]);
    }

    const addMessage = (msg: ChatMessage) => {
        setMessages(prev => [...prev, msg])
    }

    return (
        <ChatContext.Provider value={{messages, addMessage, resetMessages}}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatverlauf = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

