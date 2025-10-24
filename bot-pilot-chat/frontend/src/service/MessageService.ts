import useMessageCreator from './MessageCreator.ts';
import { useChatverlauf } from '../context/ChatContext.tsx';
import type { ButtonOption } from '../domain/ButtonOption.ts';
import type { ChatMessageText } from '../domain/ChatMessageText.ts';
import { useSocket } from '../context/SocketContext.tsx';
import dayjs, { type Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const useMessageService = () => {
  const { socket, isConnected, sessionId } = useSocket();
  const { addMessage } = useChatverlauf();
  const { createChatMessage } = useMessageCreator();

  const checkForSocket = () => {
    if (!socket || !isConnected) throw Error('Socket is not initialized');
  };

  const sendDateMessageAndGetResponse = async (date: Dayjs) => {
    checkForSocket();
    const dateUTC = date.utc();
    const printableDate = dateUTC.tz('Europe/Berlin').format('DD.MM.YYYY HH:mm');
    const message = createChatMessage(printableDate, 'user');

    socket.emit('user_uttered', {
      sessionId: sessionId,
      message: `/meeting_datetime_inform{"meeting_datetime": "${dateUTC.toISOString()}"}`,
    });
    addMessage(message);
  };

  const sendMessageAndGetResponse = async (message: string, button?: ButtonOption) => {
    checkForSocket();
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
    sendDateMessageAndGetResponse,
  };
};
export default useMessageService;
