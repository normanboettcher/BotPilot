import useRestClient from "./RestClient.ts";
import type {BotResponse} from "../domain/BotResponse.ts";
import useMessageCreator from "./MessageCreator.ts";

const MessageService = () => {

    const sendMessage = async (message: string) => {
        const {send} = useRestClient();
        const {createChatMessage} = useMessageCreator();
        try {
            const messageResponse = await send(message);
            if (!messageResponse) {
                return undefined;
            }
            const messageData = await messageResponse.json() as BotResponse;
            return createChatMessage(messageData);
        } catch (error) {
            console.error(error);
            throw Error(`Failed to send message. Received Error: ${JSON.stringify(error)}`);
        }
    }
    return {
        sendMessage
    }
}

export default MessageService;
