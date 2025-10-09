import useMessageCreator from './MessageCreator.ts';
import { useChatverlauf } from '../context/ChatContext.tsx';
import type { ButtonOption } from '../domain/ButtonOption.ts';
import type { ChatMessageText } from '../domain/ChatMessageText.ts';
import { useSocket } from '../context/SocketContext.tsx';

const useMessageService = () => {
  const { socket, isConnected, sessionId } = useSocket();
  const { addMessage } = useChatverlauf();
  const { createChatMessage } = useMessageCreator();

  const sendMessageAndGetResponse = async (message: string, button?: ButtonOption) => {
    if (!socket || !isConnected) throw Error('Socket is not initialized');
    if (button) {
      const baseMessage = createChatMessage(message, 'user', 'buttons', [button]);
      const chatMessage: ChatMessageText = {
        ...baseMessage,
        message: '',
        buttons: [
          ...baseMessage.buttons!.map((button) => ({
            ...button,
            filled: true,
          })),
        ],
      };
      socket.emit('user_uttered', { session_id: sessionId, message: message });
      addMessage(chatMessage);
    } else {
      const botMessage = createChatMessage(message, 'user');
      socket.emit('user_uttered', { session_id: sessionId, message: message });
      addMessage(botMessage);
    }
  };
  return {
    sendMessageAndGetResponse,
  };
};
export default useMessageService;
