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

  const createChatMessage = (
    message: string,
    sender: Sender,
    accessory?: 'calendar' | 'buttons',
    buttons?: ButtonOption[]
  ) => {
    const date = new Date().toLocaleDateString('de-DE', dateOptions);
    const chatMessage: ChatMessageText = {
      type: 'text',
      sender: sender,
      message: message,
      timestamp: date.replace(',', ''),
      accessory: accessory,
      buttons: buttons,
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
        filled: true,
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
