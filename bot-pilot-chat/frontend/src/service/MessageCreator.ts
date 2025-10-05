import type { ChatMessageButton, ChatMessageText } from '../domain/ChatMessageText.ts';
import type { Sender } from '../domain/Sender.ts';
import type { ButtonOption } from '../domain/ButtonOption.ts';

const useMessageCreator = () => {
  //@ts-ignore
  const dateOptions: Inc.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const createChatMessage = (text: string, sender: Sender) => {
    const date = new Date().toLocaleDateString('de-DE', dateOptions);
    const chatMessage: ChatMessageText = {
      type: 'text',
      sender: sender,
      message: text,
      timestamp: date.replace(',', ''),
    };
    return chatMessage;
  };

  const createButtonMessage = (button: ButtonOption, sender: Sender) => {
    const date = new Date().toLocaleDateString('de-DE', dateOptions);
    const chatMessage: ChatMessageButton = {
      timestamp: date.replace(',', ''),
      sender: sender,
      button: {
        payload: button.payload,
        title: button.title,
        isFilled: true,
        disabled: true,
      },
      type: 'button',
    };
    return chatMessage;
  };

  return {
    createChatMessage,
    createButtonMessage,
  };
};

export default useMessageCreator;
