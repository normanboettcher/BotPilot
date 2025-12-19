// SocketContext.tsx
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import type { BotResponse } from '../domain/BotResponse.ts';
import useMessageCreator from '../service/MessageCreator.ts';
import { useChatverlauf } from './ChatContext.tsx';

const env = process.env.NODE_ENV;
console.log(`mode: [${env}]`);
const URL =
  env === 'staging' || env === 'development' || env === 'production'
    ? undefined
    : env === 'dev'
      ? 'https://dev.staging.bot-pilot.de/'
      : 'http://localhost:5005';

console.log(`try to connect to: [${URL}]`);
const socket: Socket = io(URL);

export const SocketContext = createContext<{
  socket: Socket;
  isConnected: boolean;
  sessionId: string | null;
}>({
  socket: socket,
  isConnected: false,
  sessionId: null,
});

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { createChatMessage } = useMessageCreator();
  const { addMessage } = useChatverlauf();
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    const onBotUttered = (data: { response: BotResponse }) => {
      const { answer, sender, accessory, buttons } = data.response;
      const botResponse = createChatMessage(answer, sender, accessory, buttons);
      addMessage(botResponse);
    };

    const onConnect = () => {
      setIsConnected(true);
      console.log('connected');
      socket.emit('session_request', {});
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('disconnected');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('session_confirm', (data) => {
      setSessionId(data);
      console.log('session confirmed', data);
    });

    socket.on('bot_uttered', onBotUttered);
    console.log('useEffect triggered in context');
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('bot_uttered', onBotUttered);
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket, isConnected, sessionId }}>
      {children}
    </SocketContext.Provider>
  );
};
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket() must be used within a SocketProvider');
  }
  return context;
};
