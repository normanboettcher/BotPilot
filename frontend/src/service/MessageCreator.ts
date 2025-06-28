import type {ChatMessageType} from "../domain/ChatMessage.types.ts";
import type {BotResponse} from "../domain/BotResponse.ts";

const useMessageCreator = () => {
    const createChatMessage = (botResponse: BotResponse) => {
        const date: Date = new Date();
        const chatMessage: ChatMessageType = {
            sender: botResponse.sender,
            message: botResponse.text,
            timestamp: `${date.getDay() + 1}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
        };
        return chatMessage;
    };

    return {
        createChatMessage
    }
}

export default useMessageCreator;