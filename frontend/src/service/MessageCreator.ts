import type {ChatMessageType} from "../domain/ChatMessage.types.ts";
import type {BotResponse} from "../domain/BotResponse.ts";

const useMessageCreator = () => {

    //@ts-ignore
    const dateOptions: Inc.DateTimeFormatOptions = {
        day: '2-digit',
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    }

    const createChatMessage = (botResponse: BotResponse) => {
        const date = new Date().toLocaleDateString("de-DE", dateOptions);
        const chatMessage: ChatMessageType = {
            sender: botResponse.sender,
            message: botResponse.text,
            timestamp: date
        };
        return chatMessage;
    };

    return {
        createChatMessage
    }
}

export default useMessageCreator;