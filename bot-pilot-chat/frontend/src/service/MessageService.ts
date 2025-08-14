import type { BotResponse } from '../domain/BotResponse.ts';
import useMessageCreator from './MessageCreator.ts';
import { useEffect, useState } from 'react';
import { useChatverlauf } from '../context/ChatContext.tsx';
import { socket } from './Socket.ts';

const useMessageService = () => {
  const { addMessage } = useChatverlauf();
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { createChatMessage } = useMessageCreator();
  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log('connected');
      socket.emit('session_request', {});
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('disconnected');
    };

    const onBotUttered = (data: { response: BotResponse }) => {
      console.log('bot_uttered', data);
      const botResponse = createChatMessage(data.response.answer, data.response.sender);
      addMessage(botResponse);
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('session_confirm', (data) => {
      setSessionId(data);
      console.log('session confirmed', data);
    });
    socket.onAny((event, ...args) => {
      console.log('event', event, args);
    });
    socket.on('bot_uttered', onBotUttered);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('bot_uttered', onBotUttered);
    };
  }, []);
  const sendMessageAndGetResponse = async (message: string) => {
    if (!socket || !isConnected) throw Error('Socket is not initialized');

    socket.emit('user_uttered', { session_id: sessionId, message: message });
  };
  return {
    sendMessageAndGetResponse,
  };
};
export default useMessageService;
