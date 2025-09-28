import useMessageService from '../../service/MessageService.ts';
import useMessageCreator from '../../service/MessageCreator.ts';
import { useChatverlauf } from '../../context/ChatContext.tsx';

export const useHandleSend = () => {
  const { addMessage } = useChatverlauf();
  const { sendMessageAndGetResponse } = useMessageService();
  const { createChatMessage } = useMessageCreator();
  const handleSend = async (input: string) => {
    if (!input.trim()) return;
    const userMessage = createChatMessage(input, 'user');
    addMessage(userMessage);
    try {
      await sendMessageAndGetResponse(input);
      //response && addMessage(response);
    } catch (error) {
      console.error('Fehler beim Abrufen der Antwort:', error);
      const errorMessage = createChatMessage(
        'Fehler bei der Verbindung zum Server:',
        'bot'
      );
      addMessage(errorMessage);
    }
  };
  return { handleSend };
};

export default useHandleSend;
