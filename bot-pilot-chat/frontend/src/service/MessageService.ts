import useRestClient from "./RestClient.ts";
import type {BotResponse} from "../domain/BotResponse.ts";
import useMessageCreator from "./MessageCreator.ts";

const useMessageService = () => {

    const sendMessageAndGetResponse = async (message: string) => {
        const {send} = useRestClient();
        const {createChatMessage} = useMessageCreator();
        try {
            const messageResponse = await send(message);
            if (!messageResponse) {
                return undefined;
            }
            const messageData = await messageResponse.json() as BotResponse;
            return createChatMessage(messageData.text, 'bot');
        } catch (error) {
            console.error(error);
            throw Error(`Failed to send message. Received Error: ${JSON.stringify(error)}`);
        }
    }
    return {
        sendMessageAndGetResponse
    }
}

export default useMessageService;
