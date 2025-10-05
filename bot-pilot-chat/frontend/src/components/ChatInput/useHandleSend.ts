import useMessageService from '../../service/MessageService.ts';
import useMessageCreator from '../../service/MessageCreator.ts';
import { useChatverlauf } from '../../context/ChatContext.tsx';
import type { ButtonOption } from '../../domain/ButtonOption.ts';

export const useHandleSend = () => {
  const { addMessage } = useChatverlauf();
  const { sendMessageAndGetResponse } = useMessageService();
  const { createChatMessage, createButtonMessage } = useMessageCreator();
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

  const handleSendButtonAnswer = async (button: ButtonOption) => {
    const payload = button.payload;
    const buttonMessage = createButtonMessage(button, 'user');
    try {
      await sendMessageAndGetResponse(payload);
    } catch (error) {
      console.error('Fehler beim Abrufen der Antwort:', error);
    }
    addMessage({
      timestamp: buttonMessage.timestamp,
      type: 'text',
      message: '',
      sender: 'user',
      accessory: 'buttons',
      buttons: [buttonMessage.button],
    });
  };
  return { handleSend, handleSendButtonAnswer };
};

export default useHandleSend;
