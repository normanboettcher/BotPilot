import type { ChatMessageType } from "../domain/ChatMessage.ts";
import type { Sender } from "../domain/Sender.ts";

const useMessageCreator = () => {
  //@ts-ignore
  const dateOptions: Inc.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const createChatMessage = (text: string, sender: Sender) => {
    const date = new Date().toLocaleDateString("de-DE", dateOptions);
    const chatMessage: ChatMessageType = {
      sender: sender,
      message: text,
      timestamp: date,
    };
    return chatMessage;
  };

  return {
    createChatMessage,
  };
};

export default useMessageCreator;
