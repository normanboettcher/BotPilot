import useMessageCreator from './MessageCreator.ts';
import { useChatverlauf } from '../context/ChatContext.tsx';
import type { ButtonOption } from '../domain/ButtonOption.ts';
import type { ChatMessageText } from '../domain/ChatMessageText.ts';
import { useSocket } from '../context/SocketContext.tsx';
import dayjs from 'dayjs';
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

  const sendMessageAndGetResponse = async (
    incoming_message: string,
    button?: ButtonOption,
    calendarDate?: boolean
  ) => {
    checkForSocket();

    if (button) {
      const baseMessage = createChatMessage(incoming_message, 'user', 'buttons', [
        button,
      ]);
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
      socket.emit('user_uttered', { session_id: sessionId, message: incoming_message });
      addMessage(chatMessage);
    } else if (calendarDate) {
      const date = dayjs(incoming_message);
      const dateUTC = date.utc();
      const printableDate = dateUTC.tz('Europe/Berlin').format('DD.MM.YYYY HH:mm');
      const userMessage = createChatMessage(printableDate, 'user');
      socket.emit('user_uttered', {
        session_id: sessionId,
        message: `/meeting_datetime_inform{"meeting_datetime": "${dateUTC.toISOString()}"}`,
      });
      addMessage(userMessage);
    } else {
      const botMessage = createChatMessage(incoming_message, 'user');
      socket.emit('user_uttered', { session_id: sessionId, message: incoming_message });
      addMessage(botMessage);
    }
  };
  return {
    sendMessageAndGetResponse,
  };
};
export default useMessageService;
