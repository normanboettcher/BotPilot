import useRestClient from "./RestClient.ts";
import type {BotResponse} from "../types.ts";

const MessageService = () => {

    const sendMessage = async (message: string) => {
        const {send} = useRestClient();
        try {
            const messageResponse = await send(message);
            //handle undefined
            const messageData = await messageResponse.json() as BotResponse;
            //create Message and return
        } catch (error) {
            console.error(error);
        }
    }
    return {
        sendMessage
    }
}

export default MessageService;
